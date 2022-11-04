import mockTranslations from './mockTranslations';
import { createResolvablePromise } from './createResolvablePromise';

export const mockStaticDataAsync = () => {
  const resolvablePromises: Record<
    keyof typeof mockTranslations,
    ReturnType<typeof createResolvablePromise>
  > = {} as any;
  const promises: Record<keyof typeof mockTranslations, () => Promise<any>> =
    {} as any;
  Object.entries(mockTranslations).forEach(([key, data]) => {
    const resolvablePromise = createResolvablePromise(data);
    resolvablePromises[key as keyof typeof mockTranslations] =
      resolvablePromise;
    promises[key as keyof typeof mockTranslations] = () =>
      resolvablePromise.promise;
  });
  return {
    resolvablePromises,
    promises,
    resolveAll: () => {
      Object.values(resolvablePromises).forEach((p) => p.resolve());
    },
  };
};
