import mockTranslations from './mockTranslations';
import { createResolvablePromise } from './createResolvablePromise';
import { wait } from './wait';

export const mockStaticDataAsync = () => {
  const resolvablePromises: Record<
    keyof typeof mockTranslations,
    ReturnType<typeof createResolvablePromise>
  > = {} as any;
  const promises: Record<keyof typeof mockTranslations, () => Promise<any>> =
    {} as any;
  Object.entries(mockTranslations).forEach(([key, data]) => {
    promises[key as keyof typeof mockTranslations] = () => {
      const resolvablePromise = createResolvablePromise(data);
      resolvablePromises[key as keyof typeof mockTranslations] =
        resolvablePromise;
      return resolvablePromise.promise;
    };
  });
  return {
    resolvablePromises,
    promises,
    resolvePending: async () => {
      // wait for promises to be created
      await wait(0);
      // now resolve them
      Object.values(resolvablePromises).forEach((p) => p.resolve());
    },
  };
};
