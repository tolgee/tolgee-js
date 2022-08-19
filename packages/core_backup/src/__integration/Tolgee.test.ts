jest.autoMockOff();

import { waitFor } from '@testing-library/dom';
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

describe('Tolgee invisble mode', () => {
  let tolgee: Tolgee;
  beforeEach(async () => {
    fetch.enableMocks();
    tolgee = Tolgee.init({
      targetElement: document.body,
      apiKey: API_KEY,
      apiUrl: API_URL,
      inputPrefix: '{{',
      inputSuffix: '}}',
    });
    document.body.innerHTML = '';
    await tolgee.run();
  });

  afterEach(() => {
    tolgee.stop();
  });

  it('it translate text in body', async () => {
    document.body.innerHTML = '{{hello_world}}';

    await waitFor(() => {
      const el = document
        .evaluate(
          "descendant-or-self::*[contains(text(), 'Hello world!')]",
          document.body,
          null,
          0
        )
        .iterateNext();

      expect(el).toBeInTheDocument();
    });
  });

  it('returns default when provided', async () => {
    expect(
      await tolgee.translate({
        key: 'nonexistant',
        noWrap: true,
        defaultValue: 'This is default',
      })
    ).toEqual('This is default');
  });

  test('returns empty value if orEmpty is true', async () => {
    expect(
      await tolgee.translate({
        key: 'nonexistant',
        noWrap: true,
        orEmpty: true,
      })
    ).toEqual('');
  });

  test('will return key when no translation found', async () => {
    expect(
      await tolgee.translate({ key: 'test\\.key.this\\.is\\.it', noWrap: true })
    ).toEqual('test\\.key.this\\.is\\.it');
  });

  test('will return proper text without any dot', async () => {
    expect(
      await tolgee.translate({ key: 'text without any dot', noWrap: true })
    ).toEqual('text without any dot');
  });
});
