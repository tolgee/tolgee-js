import {
  FallbackGeneral,
  FallbackLanguageObject,
  FallbackLanguageOption,
  FetchFn,
  TolgeeError,
  ErrorEvent,
} from './types';
import { EventEmitterInstance } from './Controller/Events/EventEmitter';

export function isPromise(value: unknown): value is Promise<unknown> {
  return Boolean(
    value && typeof (value as unknown as Promise<unknown>).then === 'function'
  );
}

export function valueOrPromise<T, R>(
  value: T | Promise<T>,
  callback: (value: T) => R
) {
  if (isPromise(value)) {
    return Promise.resolve(value).then(callback);
  } else {
    return callback(value as T);
  }
}

export function handleRegularOrAsyncErr<T>(
  onError: EventEmitterInstance<ErrorEvent>,
  createError: (e: any) => TolgeeError,
  callback: () => Promise<T> | T
): Promise<T> | T {
  function handle(e: any): never {
    const error = createError(e);
    onError.emit(error);
    // eslint-disable-next-line no-console
    console.error(error);
    throw error;
  }
  try {
    const result = callback();
    if (isPromise(result)) {
      return result.catch(handle);
    }
    return result;
  } catch (e) {
    handle(e);
  }
}

export function missingOptionError(option: string | string[]) {
  const options = (Array.isArray(option) ? option : [option]).map(
    (val) => `'${val}'`
  );

  const lastPart = options.slice(-2).join(' or ');
  const firstPart = options.slice(0, -2);
  const stringifiedOptions = [...firstPart, lastPart].join(', ');

  return `Tolgee: You need to specify ${stringifiedOptions} option`;
}

export function isObject(item: any) {
  return typeof item === 'object' && !Array.isArray(item) && item !== null;
}

export function getFallback(value: FallbackGeneral): string[] | undefined {
  if (typeof value === 'string') {
    return [value];
  }
  if (Array.isArray(value)) {
    return value;
  }
  return undefined;
}

export function getFallbackArray(value: FallbackGeneral): string[] {
  return getFallback(value) || [];
}

export function getFallbackFromStruct(
  language: string,
  fallbackLanguage: FallbackLanguageOption
) {
  if (isObject(fallbackLanguage)) {
    return getFallbackArray(
      (fallbackLanguage as FallbackLanguageObject)?.[language]
    );
  } else {
    return getFallbackArray(fallbackLanguage as FallbackGeneral);
  }
}

export function unique<T>(arr: T[]) {
  return Array.from(new Set(arr));
}

export function sanitizeUrl(url: string | undefined) {
  return url ? url.replace(/\/+$/, '') : url;
}

export function getErrorMessage(error: any): string | undefined {
  if (typeof error === 'string') {
    return error;
  } else if (typeof error?.message === 'string') {
    return error.message;
  }
}

const defaultFetchFunction: FetchFn = (input, options) => fetch(input, options);

function headersInitToRecord(headersInit?: HeadersInit | undefined) {
  return Object.fromEntries(new Headers(headersInit).entries());
}

export const createFetchFunction = (
  fetchFn: FetchFn = defaultFetchFunction
): FetchFn => {
  return (input, init) => {
    let headers = headersInitToRecord(init?.headers);
    if (headers['x-api-key']) {
      headers = {
        'x-tolgee-sdk-type': 'JS',
        'x-tolgee-sdk-version': process.env.TOLGEE_UI_VERSION || 'prerelease',
        ...headers,
      };
    }
    return fetchFn(input, {
      ...init,
      headers,
    });
  };
};
