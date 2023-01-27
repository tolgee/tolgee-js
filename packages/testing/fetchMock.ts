import mockTranslations from './mockTranslations';
import fetchMock from 'jest-fetch-mock';
import { currentApiKeyMock } from './currentApiKeyMock';
import { createResolvablePromise } from './createResolvablePromise';

export const mockCoreFetch = () => {
  const asyncFetchResult = mockCoreFetchAsync();
  asyncFetchResult.resolveAll();
  return asyncFetchResult.fetch;
};

export const mockCoreFetchAsync = () => {
  const result = {
    currentApiKey: createResolvablePromise(JSON.stringify(currentApiKeyMock)),
    csTranslations: createResolvablePromise(
      JSON.stringify({ cs: mockTranslations.cs })
    ),
    enTranslations: createResolvablePromise(
      JSON.stringify({ en: mockTranslations.en })
    ),
    enTestTranslations: createResolvablePromise(
      JSON.stringify({ 'en:test': mockTranslations['en:test'] })
    ),
    csTestTranslations: createResolvablePromise(
      JSON.stringify({ 'cs:test': mockTranslations['cs:test'] })
    ),
  };

  const resolveAll = () =>
    Object.values(result).forEach((resolvablePromise) => {
      resolvablePromise.resolve();
    });

  const fetch = fetchMock.mockResponse((req) => {
    if (req.url.includes('/v2/api-keys/current')) {
      return result.currentApiKey.promise;
    } else if (
      req.url.includes('/v2/projects/translations/en?ns=translation')
    ) {
      return result.enTranslations.promise;
    } else if (
      req.url.includes('/v2/projects/translations/cs?ns=translation')
    ) {
      return result.csTranslations.promise;
    } else if (req.url.includes('/v2/projects/translations/en?ns=test')) {
      return result.enTranslations.promise;
    } else if (req.url.includes('/v2/projects/translations/cs?ns=test')) {
      return result.csTranslations.promise;
    } else if (req.url.includes('/v2/projects/translations/en')) {
      return result.enTranslations.promise;
    } else if (req.url.includes('/v2/projects/translations/cs')) {
      return result.csTranslations.promise;
    }

    throw new Error('Invalid request');
  });

  return { ...result, fetch, resolveAll };
};
