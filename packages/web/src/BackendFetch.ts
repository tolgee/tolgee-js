import type { BackendMiddleware, TolgeePlugin } from '@tolgee/core';
import { GetPath, BackendOptions } from './types';

const trimSlashes = (path: string) => {
  if (path.endsWith('/')) {
    return path.slice(0, -1);
  }
  return path;
};

const defaultGetPath: GetPath = ({ namespace, language, prefix }) => {
  if (namespace) {
    return `${trimSlashes(prefix)}/${namespace}/${language}.json`;
  } else {
    return `${trimSlashes(prefix)}/${language}.json`;
  }
};

const defaultGetData = (r: Response) => r.json();

const DEFAULT_OPTIONS = {
  prefix: '/i18n',
  getPath: defaultGetPath,
  getData: defaultGetData,
  headers: {
    Accept: 'application/json',
  },
};

const createBackendFetch = (
  options?: Partial<BackendOptions>
): BackendMiddleware => {
  const { prefix, getPath, getData, headers, ...fetchOptions }: BackendOptions =
    {
      ...DEFAULT_OPTIONS,
      ...options,
      headers: {
        ...DEFAULT_OPTIONS.headers,
        ...options?.headers,
      },
    };
  return {
    getRecord({ namespace, language }) {
      const path = getPath({
        namespace,
        language,
        prefix,
      });
      return fetch(path, { headers, ...fetchOptions }).then((r) => {
        if (!r.ok) {
          throw new Error(`${r.url} ${r.status}`);
        }
        return getData(r);
      });
    },
  };
};

export const BackendFetch =
  (options?: Partial<BackendOptions>): TolgeePlugin =>
  (tolgee, tools) => {
    tools.addBackend(createBackendFetch(options));
    return tolgee;
  };
