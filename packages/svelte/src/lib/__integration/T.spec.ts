import fetchMock from 'jest-fetch-mock';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/svelte';

import mockTranslations from './data/mockTranslations';
import { testConfig } from './data/testConfig';
import TestTComponent from './components/TestTComponent.svelte';
import { Tolgee, type TolgeeInstance } from '@tolgee/core';
import { SveltePlugin } from '$lib/SveltePlugin';
import { FormatIcu } from '@tolgee/format-icu';

const API_URL = 'http://localhost';
const API_KEY = 'dummyApiKey';

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
  let tolgee: TolgeeInstance;

  beforeEach(async () => {
    fetch.enableMocks();

    tolgee = Tolgee().use(SveltePlugin()).use(FormatIcu()).init({
      apiKey: API_KEY,
      apiUrl: API_URL,
      defaultLanguage: 'cs',
      fallbackLanguage: 'en',
    });

    render(TestTComponent, {
      tolgee,
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
    expect(screen.queryByTestId('hello_world')).toHaveAttribute('_tolgee');
  });

  it('works with no wrap', async () => {
    expect(screen.queryByTestId('hello_world_no_wrap').innerHTML).toContain(
      'Ahoj světe!'
    );
    expect(screen.queryByTestId('hello_world_no_wrap')).not.toHaveAttribute(
      '_tolgee'
    );
  });

  it('works with parameters', async () => {
    expect(screen.queryByTestId('peter_dogs').innerHTML).toContain(
      'Petr má 5 psů.'
    );
    expect(screen.queryByTestId('peter_dogs')).toHaveAttribute('_tolgee');
  });

  it('works with default value', async () => {
    expect(screen.queryByTestId('non_existant').innerHTML).toContain(
      'Non existant'
    );
    expect(screen.queryByTestId('non_existant')).toHaveAttribute('_tolgee');
  });

  describe('language switch', () => {
    beforeEach(async () => {
      await tolgee.changeLanguage('en');
    });

    it('changes translation with tags', async () => {
      expect(screen.queryByTestId('hello_world').innerHTML).toContain(
        'Hello world!'
      );
      expect(screen.queryByTestId('hello_world')).toHaveAttribute('_tolgee');
    });
  });
});
