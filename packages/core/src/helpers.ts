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
