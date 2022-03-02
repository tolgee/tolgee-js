jest.autoMockOff();

import fetchMock from 'jest-fetch-mock';
import '@testing-library/jest-dom/extend-expect';
import { render, screen, waitFor } from '@testing-library/svelte';

import mockTranslations from './data/mockTranslations';
import { testConfig } from './data/testConfig';
import TestTComponent from './components/TestTComponent.svelte';

const API_URL = 'http://localhost';
const API_KEY = 'dummyApiKey';

export const instanceRef = { changeLanguage: null };

const fetch = fetchMock.mockResponse(async (req) => {
  if (req.url.includes('/v2/api-keys/current')) {
    return JSON.stringify(testConfig);
  } else if (req.url.includes('/v2/projects/translations/en')) {
    return JSON.stringify({ en: mockTranslations.en });
  } else if (req.url.includes('/v2/projects/translations/cs')) {
    return JSON.stringify({ cs: mockTranslations.cs });
  }

  throw new Error('Invalid request');
});

describe('T component integration', () => {
  beforeEach(async () => {
    fetch.enableMocks();

    render(TestTComponent, {
      config: {
        apiKey: API_KEY,
        apiUrl: API_URL,
        defaultLanguage: 'cs',
        fallbackLanguage: 'en',
      },
      instanceRef,
    });

    await waitFor(() => {
      expect(screen.queryByTestId('hello_world').innerHTML).toContain(
        'Ahoj světe!'
      );
    });
  });

  it('wraps translation correctly', async () => {
    expect(screen.queryByTestId('hello_world').innerHTML).toContain(
      'Ahoj světe!'
    );
    expect(screen.queryByTestId('hello_world')).toHaveProperty('_tolgee');
  });

  it('works with no wrap', async () => {
    expect(screen.queryByTestId('hello_world_no_wrap').innerHTML).toContain(
      'Ahoj světe!'
    );
    expect(screen.queryByTestId('hello_world_no_wrap')).not.toHaveProperty(
      '_tolgee'
    );
  });

  it('works with parameters', async () => {
    expect(screen.queryByTestId('peter_dogs').innerHTML).toContain(
      'Petr má 5 psů.'
    );
    expect(screen.queryByTestId('peter_dogs')).toHaveProperty('_tolgee');
  });

  it('works with default value', async () => {
    expect(screen.queryByTestId('non_existant').innerHTML).toContain(
      'Non existant'
    );
    expect(screen.queryByTestId('non_existant')).toHaveProperty('_tolgee');
  });

  describe('language switch', () => {
    beforeEach(async () => {
      await instanceRef.changeLanguage('en');
    });

    it('changes translation with tags', async () => {
      expect(screen.queryByTestId('hello_world').innerHTML).toContain(
        'Hello world!'
      );
      expect(screen.queryByTestId('hello_world')).toHaveProperty('_tolgee');
    });
  });
});
