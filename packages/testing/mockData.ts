import { createResolvablePromise } from './createResolvablePromise';
import mockTranslations from './mockTranslations';
import { currentApiKeyMock } from './currentApiKeyMock';

export const getMocker = () => {
  const mockData = {
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

  function getDataForUrl(url: string) {
    if (url.includes('/v2/api-keys/current')) {
      return mockData.currentApiKey.promise;
    } else if (url.includes('/v2/projects/translations/en?ns=translation')) {
      return mockData.enTranslations.promise;
    } else if (url.includes('/v2/projects/translations/cs?ns=translation')) {
      return mockData.csTranslations.promise;
    } else if (url.includes('/v2/projects/translations/en?ns=test')) {
      return mockData.enTranslations.promise;
    } else if (url.includes('/v2/projects/translations/cs?ns=test')) {
      return mockData.csTranslations.promise;
    } else if (url.includes('/v2/projects/translations/en')) {
      return mockData.enTranslations.promise;
    } else if (url.includes('/v2/projects/translations/cs')) {
      return mockData.csTranslations.promise;
    }

    throw new Error('Invalid request');
  }

  const resolveAll = () =>
    Object.values(mockData).forEach((resolvablePromise) => {
      resolvablePromise.resolve();
    });

  return { getDataForUrl, resolveAll, mockData };
};
