import { ApiClient } from '../utils/ApiClient';
import { TranslationsCache } from '../utils/TranslationsCache';
import { translationsToFlat } from '../utils/translationsTools';

export const ResourcesService = (apiUrl: string, apiKey: string) => {
  const cache = TranslationsCache();
  const apiClient = ApiClient(apiUrl, apiKey);

  const loadBundle = (language: string, scope: string) => {
    const dataPromise = apiClient
      .getTranslations(language, scope)
      .then(translationsToFlat);
    cache.insert(language, scope, dataPromise);
    return dataPromise;
  };

  return Object.freeze({
    loadBundle,
  });
};

export type ResourcesServiceInstance = ReturnType<typeof ResourcesService>;
