import fetchMock from 'jest-fetch-mock';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/svelte';

import mockTranslations from './data/mockTranslations';
import { testConfig } from './data/testConfig';
import TestProviderComponent from './components/TestProviderComponent.svelte';
import { Tolgee, type TolgeeInstance } from '@tolgee/core';
import { SveltePlugin } from '$lib/SveltePlugin';
import { FormatIcu } from '@tolgee/format-icu';

const API_URL = 'http://localhost';
const API_KEY = 'dummyApiKey';

const createFetchMock = () => {
  let resolveCzech;
  let resolveEnglish;
  const czechPromise = new Promise((resolve) => {
    resolveCzech = () => {
      resolve(JSON.stringify({ cs: mockTranslations.cs }));
    };
  });

  const englishPromise = new Promise((resolve) => {
    resolveEnglish = () => {
      resolve(JSON.stringify({ en: mockTranslations.en }));
    };
  });

  const fetch = fetchMock.mockResponse(async (req) => {
    if (req.url.includes('/v2/api-keys/current')) {
      return JSON.stringify(testConfig);
    } else if (req.url.includes('/v2/projects/translations/en')) {
      return englishPromise;
    } else if (req.url.includes('/v2/projects/translations/cs')) {
      return czechPromise;
    }
    throw new Error('Invalid request');
  });
  return { fetch, resolveCzech, resolveEnglish };
};

describe('TolgeeProvider integration', () => {
  let tolgee: TolgeeInstance;
  let resolveEnglish;
  let resolveCzech;
  beforeEach(async () => {
    const fetchMock = createFetchMock();
    resolveCzech = fetchMock.resolveCzech;
    resolveEnglish = fetchMock.resolveEnglish;
    fetchMock.fetch.enableMocks();

    tolgee = Tolgee().use(SveltePlugin()).use(FormatIcu()).init({
      apiKey: API_KEY,
      apiUrl: API_URL,
      defaultLanguage: 'cs',
      fallbackLanguage: 'en',
    });

    render(TestProviderComponent, {
      tolgee,
    });
  });

  it('shows correctly loading, fallback and default value', async () => {
    await waitFor(() => {
      expect(screen.queryByText('Loading...')?.innerHTML).toContain(
        'Loading...'
      );
    });
    resolveCzech();
    await waitFor(() => {
      expect(screen.queryByText('Loading...')?.innerHTML).toContain(
        'Loading...'
      );
    });
    resolveEnglish();
    await waitFor(() => {
      expect(screen.queryByTestId('hello_world').innerHTML).toContain(
        'Ahoj světe!'
      );
      expect(screen.queryByTestId('english_fallback').innerHTML).toContain(
        'English fallback'
      );
      expect(screen.queryByTestId('non_existant').innerHTML).toContain(
        'Default value'
      );
    });
  });
});
