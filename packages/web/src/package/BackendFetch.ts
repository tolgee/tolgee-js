import type { BackendMiddleware, FetchFn, TolgeePlugin } from '@tolgee/core';
import { GetPath, BackendOptions } from './types';

const fetchWithTimeout = (
  fetch: FetchFn,
  url: string,
  ms: number | undefined,
  { signal, ...options }: RequestInit
) => {
  const controller = new AbortController();
  return new Promise<Response>((_resolve, _reject) => {
    const promise = fetch(url, { signal: controller.signal, ...options });
    let done = false;
    function resolve(data) {
      !done && _resolve(data);
      done = true;
    }
    function reject(data) {
      !done && _reject(data);
      done = true;
    }
    function rejectWithTimout() {
      const error = new Error(`TIMEOUT: ${url}`);
      controller.abort(error);
      reject(error);
    }
    if (signal) {
      signal.addEventListener('abort', rejectWithTimout);
    }
    if (ms !== undefined) {
      const timeout = setTimeout(rejectWithTimout, ms);
      promise.finally(() => clearTimeout(timeout));
    }
    promise.catch(reject).then(resolve);
  });
};

function trimSlashes(path: string) {
  if (path.endsWith('/')) {
    return path.slice(0, -1);
  }
  return path;
}

const defaultGetPath: GetPath = ({ namespace, language, prefix }) => {
  if (namespace) {
    return `${trimSlashes(prefix)}/${namespace}/${language}.json`;
  } else {
    return `${trimSlashes(prefix)}/${language}.json`;
  }
};

function defaultGetData(r: Response) {
  return r.json();
}

const DEFAULT_OPTIONS = {
  prefix: '/i18n',
  getPath: defaultGetPath,
  getData: defaultGetData,
  headers: {
    Accept: 'application/json',
  },
  timeout: undefined,
  fallbackOnFail: false,
};

export function createBackendFetch(
  options?: Partial<BackendOptions>
): BackendMiddleware {
  const {
    prefix,
    getPath,
    getData,
    headers,
    timeout,
    fallbackOnFail,
    ...fetchOptions
  }: BackendOptions = {
    ...DEFAULT_OPTIONS,
    ...options,
    headers: {
      ...DEFAULT_OPTIONS.headers,
      ...options?.headers,
    },
  };
  return {
    async getRecord({ namespace, language, fetch }) {
      const path = getPath({
        namespace,
        language,
        prefix,
      });

      try {
        const r = await fetchWithTimeout(fetch, path, timeout, {
          headers,
          ...fetchOptions,
        });
        if (!r.ok) {
          throw new Error(`${r.url} ${r.status}`);
        }
        return await getData(r);
      } catch (e) {
        if (fallbackOnFail) {
          return undefined;
        } else {
          throw e;
        }
      }
    },
  };
}

export const BackendFetch =
  (options?: Partial<BackendOptions>): TolgeePlugin =>
  (tolgee, tools) => {
    tools.addBackend(createBackendFetch(options));
    return tolgee;
  };
