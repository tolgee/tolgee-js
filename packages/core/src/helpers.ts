import {
  FallbackGeneral,
  FallbackLanguageObject,
  FallbackLanguageOption,
} from './types';

export function isPromise(value: any) {
  return Boolean(value && typeof value.then === 'function');
}

export const valueOrPromise = <T, R>(
  value: T | Promise<T>,
  callback: (value: T) => R
) => {
  if (isPromise(value)) {
    return Promise.resolve(value).then(callback);
  } else {
    return callback(value as T);
  }
};

export const missingOptionError = (option: string) =>
  `Tolgee: You need to specify '${option}' option`;

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
