export const resolvablePromise = <T = any>() => {
  let resolve: (value: T) => void;
  const promise = new Promise<T>((innerResolve) => {
    resolve = innerResolve;
  });
  return [promise, resolve!] as const;
};
