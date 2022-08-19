jest.autoMockOff();

import '@testing-library/jest-dom/extend-expect';
import { IcuFormatter, Tolgee } from '../index';
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

describe('Tolgee with icu formatter', () => {
  let tolgee: Tolgee;
  beforeEach(async () => {
    fetch.enableMocks();
    tolgee = Tolgee.use(IcuFormatter).init({
      targetElement: document.body,
      apiKey: API_KEY,
      apiUrl: API_URL,
      inputPrefix: '{{',
      inputSuffix: '}}',
      watch: false,
    });
    document.body.innerHTML = '';
    await tolgee.run();
  });

  afterEach(() => {
    tolgee.stop();
  });

  it('Formats variable', async () => {
    const translation = await tolgee.translate(
      'peter_dogs',
      { dogsCount: '10' },
      true
    );
    expect(translation).toEqual('Peter has 10 dogs.');

    const instantTranslation = tolgee.instant(
      'peter_dogs',
      { dogsCount: '10' },
      true
    );
    expect(instantTranslation).toEqual('Peter has 10 dogs.');
  });

  it('Wont format key', async () => {
    const translation = await tolgee.translate(
      'weird {key}',
      { key: '10' },
      true
    );
    expect(translation).toEqual('weird {key}');

    const instantTranslation = tolgee.instant(
      'weird {key}',
      { key: '10' },
      true
    );
    expect(instantTranslation).toEqual('weird {key}');
  });

  it('Returns key if missing', async () => {
    const translation = await tolgee.translate('nonexistant', undefined, true);
    expect(translation).toEqual('nonexistant');

    const instantTranslation = tolgee.instant('nonexistant', undefined, true);
    expect(instantTranslation).toEqual('nonexistant');
  });
});
