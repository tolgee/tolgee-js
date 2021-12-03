jest.autoMockOff();

import '@testing-library/jest-dom/extend-expect';
import mockTranslations from './mockTranslations';
import fetchMock from 'jest-fetch-mock';
import { testConfig } from './testConfig';
import i18n from 'i18next';
import { withTolgee } from '..';

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
    i18next = withTolgee(i18n.createInstance(), {
      targetElement: document.body,
      apiKey: API_KEY,
      apiUrl: API_URL,
      watch: false,
    });
    await i18next.init({ lng: 'en', supportedLngs: ['en'] });
    document.body.innerHTML = '';
  });

  afterEach(() => {
    i18next.tolgee.stop();
  });

  it('wraps translation correctly', async () => {
    const translation = i18next.t('hello_world');
    // @ts-ignore accessing private property
    const result = await i18next.tolgee.dependencyService.wrapper.unwrap(
      translation
    );
    expect(result.keys.map(({ key }) => key)).toEqual(['hello_world']);
  });

  it('wraps missing key correctly', async () => {
    const translation = i18next.t('nonexistant');
    // @ts-ignore accessing private property
    const result = await i18next.tolgee.dependencyService.wrapper.unwrap(
      translation
    );
    expect(result.keys.map(({ key }) => key)).toEqual(['nonexistant']);
  });

  it('wraps default value correctly', async () => {
    const translation = i18next.t('nonexistant', {
      defaultValue: 'Default value',
    });
    // @ts-ignore accessing private property
    const result = await i18next.tolgee.dependencyService.wrapper.unwrap(
      translation
    );

    expect(result.text).toEqual('Default value');
    expect(result.keys.map(({ defaultValue }) => defaultValue)).toEqual([
      'Default value',
    ]);
    expect(result.keys.map(({ key }) => key)).toEqual(['nonexistant']);
  });
});
