jest.autoMockOff();

import fetchMock from 'jest-fetch-mock';
import '@testing-library/jest-dom/extend-expect';
import { render, screen, waitFor } from '@testing-library/vue';

import mockTranslations from './mockTranslations';
import { testConfig } from './testConfig';
import { TolgeeProvider, TolgeeMixin } from '..';

const API_URL = 'http://localhost';
const API_KEY = 'dummyApiKey';

export const createFetchMock = () => {
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

const TestComponent = {
  mixins: [TolgeeMixin],
  template: `
    <div>
      <div data-testid="hello_world">
        {{ $t("hello_world") }}
      </div>
      <div data-testid="english_fallback">
        {{ $t('english_fallback', 'Default value') }}
      </div>
      <div data-testid="non_existant">
        {{ $t("non_existant", "Default value") }}
      </div>
    </div>`,
};

const WrapperComponent = {
  components: { TestComponent, TolgeeProvider },
  template: `
    <TolgeeProvider
      :config="config"
    >
      <TestComponent />
    </TolgeeProvider>
  `,
  props: ['config'],
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
      render(WrapperComponent, {
        props: {
          config: {
            apiKey: API_KEY,
            apiUrl: API_URL,
            defaultLanguage: 'cs',
            fallbackLanguage: 'en',
          },
          loadingFallback: 'Loading...',
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
      render(WrapperComponent, {
        props: {
          config: {
            apiKey: API_KEY,
            apiUrl: API_URL,
            defaultLanguage: 'cs',
            fallbackLanguage: 'en',
            preloadFallback: true,
          },
          loadingFallback: 'Loading...',
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
