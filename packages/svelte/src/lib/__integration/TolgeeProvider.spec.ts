jest.autoMockOff();

import fetchMock from 'jest-fetch-mock';
import '@testing-library/jest-dom/extend-expect';
import { render, screen, waitFor } from '@testing-library/svelte';

import mockTranslations from './data/mockTranslations';
import { testConfig } from './data/testConfig';
import TestProviderComponent from './components/TestProviderComponent.svelte';

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
  describe('regular settings', () => {
    let resolveEnglish;
    let resolveCzech;
    beforeEach(async () => {
      const fetchMock = createFetchMock();
      resolveCzech = fetchMock.resolveCzech;
      resolveEnglish = fetchMock.resolveEnglish;
      fetchMock.fetch.enableMocks();
      render(TestProviderComponent, {
        config: {
          apiKey: API_KEY,
          apiUrl: API_URL,
          defaultLanguage: 'cs',
          fallbackLanguage: 'en',
        },
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
        expect(screen.queryByTestId('hello_world').innerHTML).toContain(
          'Ahoj světe!'
        );
        expect(
          screen.queryByTestId('english_fallback').innerHTML
        ).not.toContain('Default value');
        expect(screen.queryByTestId('non_existant').innerHTML).not.toContain(
          'Default value'
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

  describe('with preloadFallback', () => {
    let resolveEnglish;
    let resolveCzech;
    beforeEach(async () => {
      const fetchMock = createFetchMock();
      resolveCzech = fetchMock.resolveCzech;
      resolveEnglish = fetchMock.resolveEnglish;
      fetchMock.fetch.enableMocks();
      render(TestProviderComponent, {
        config: {
          apiKey: API_KEY,
          apiUrl: API_URL,
          defaultLanguage: 'cs',
          fallbackLanguage: 'en',
          preloadFallback: true,
        },
      });
    });

    it('shows correctly loading, fallback and default value', async () => {
      expect(screen.queryByText('Loading...')?.innerHTML).toContain(
        'Loading...'
      );
      resolveCzech();

      await waitFor(() => {
        expect(screen.queryByText('Loading...')?.innerHTML).toContain(
          'Loading...'
        );
        expect(screen.queryByTestId('hello_world')).toBeFalsy();
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
});
