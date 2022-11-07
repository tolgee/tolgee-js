jest.autoMockOff();

import '@testing-library/jest-dom';
import mockTranslations from './mockTranslations';
import fetchMock from 'jest-fetch-mock';
import { testConfig } from './testConfig';
import i18n from 'i18next';
import { Tolgee } from '@tolgee/web';
import { withTolgee, I18nextPlugin } from '..';

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

describe('withTolgee', () => {
  let i18next: typeof i18n;
  beforeEach(async () => {
    fetch.enableMocks();
    const tolgee = Tolgee().use(I18nextPlugin()).init({
      apiKey: API_KEY,
      apiUrl: API_URL,
    });
    i18next = withTolgee(i18n.createInstance(), tolgee);
    await i18next.init({ lng: 'en', supportedLngs: ['en'] });
    document.body.innerHTML = '';
  });

  afterEach(() => {
    i18next.tolgee.stop();
  });

  it('wraps translation correctly', async () => {
    const translation = i18next.t('hello_world');
    const result = i18next.tolgee.unwrap(translation);
    expect(result.keys.map(({ key }) => key)).toEqual(['hello_world']);
  });

  it('wraps missing key correctly', async () => {
    const translation = i18next.t('nonexistant');
    const result = i18next.tolgee.unwrap(translation);
    expect(result.keys.map(({ key }) => key)).toEqual(['nonexistant']);
  });

  it('wraps default value correctly', async () => {
    const translation = i18next.t('nonexistant', {
      defaultValue: 'Default value',
    });

    const result = i18next.tolgee.unwrap(translation);

    expect(result.text).toEqual('Default value');
    expect(result.keys.map(({ defaultValue }) => defaultValue)).toEqual([
      'Default value',
    ]);
    expect(result.keys.map(({ key }) => key)).toEqual(['nonexistant']);
  });
});
