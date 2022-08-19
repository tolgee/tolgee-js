jest.autoMockOff();

import '@testing-library/jest-dom/extend-expect';
import { Tolgee } from '..';
import mockTranslations from './mockTranslations';
import fetchMock from 'jest-fetch-mock';
import { testConfig } from './testConfig';

const API_URL = 'http://localhost';
const API_KEY = 'dummyApiKey';

const fetch = fetchMock.mockResponse(async (req) => {
  if (req.url.includes('/v2/api-keys/current')) {
    return JSON.stringify(testConfig);
  } else if (req.url.includes('/v2/projects/translations/en')) {
    return JSON.stringify(mockTranslations);
  }
  throw new Error('Invalid request');
});

describe('Tolgee without formatter', () => {
  let tolgee: Tolgee;
  beforeEach(async () => {
    fetch.enableMocks();
    tolgee = Tolgee.init({
      targetElement: document.body,
      apiKey: API_KEY,
      apiUrl: API_URL,
      watch: false,
    });
    document.body.innerHTML = '';
    await tolgee.run();
  });

  afterEach(() => {
    tolgee.stop();
  });

  it('Returns plain translation', async () => {
    const translation = await tolgee.translate('peter_dogs', undefined, true);
    expect(translation).toEqual('Peter has {dogsCount} dogs.');

    const instantTranslation = tolgee.instant('peter_dogs', undefined, true);
    expect(instantTranslation).toEqual('Peter has {dogsCount} dogs.');
  });

  it('Returns key if missing', async () => {
    const translation = await tolgee.translate('nonexistant', undefined, true);
    expect(translation).toEqual('nonexistant');

    const instantTranslation = tolgee.instant('nonexistant', undefined, true);
    expect(instantTranslation).toEqual('nonexistant');
  });
});
