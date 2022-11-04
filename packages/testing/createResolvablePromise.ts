export const createResolvablePromise = <T>(
  data: T
): { promise: Promise<T>; resolve: () => void } => {
  let resolve: (data: T) => void;
  return {
    promise: new Promise<T>((resolveArg) => {
      resolve = resolveArg;
    }),
    resolve: () => resolve(data),
  };
};
