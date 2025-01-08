import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/svelte';

import TestTComponent from './components/TestTComponent.svelte';
import { DevTools, Tolgee, type TolgeeInstance } from '@tolgee/web';
import { FormatIcu } from '@tolgee/format-icu';
import { mockCoreFetch } from './mockCoreFetch';

const API_URL = 'http://localhost';
const API_KEY = 'dummyApiKey';

describe('T component integration', () => {
  let tolgee: TolgeeInstance;

  beforeEach(async () => {
    const fetcher = mockCoreFetch();
    fetcher.resolveAll();
    fetcher.fetch.enableMocks();

    tolgee = Tolgee().use(DevTools()).use(FormatIcu()).init({
      apiKey: API_KEY,
      apiUrl: API_URL,
      defaultLanguage: 'cs',
      fallbackLanguage: 'en'
    });

    render(TestTComponent, {
      tolgee
    });

    await waitFor(() => {
      expect(screen.queryByTestId('hello_world')?.innerHTML).toContain('Ahoj světe!');
    });
  });

  it('wraps translation correctly', async () => {
    expect(screen.queryByTestId('hello_world')?.innerHTML).toContain('Ahoj světe!');
    expect(screen.queryByTestId('hello_world')).toHaveAttribute('_tolgee');
  });

  it('works with no wrap', async () => {
    expect(screen.queryByTestId('hello_world_no_wrap')?.innerHTML).toContain('Ahoj světe!');
    expect(screen.queryByTestId('hello_world_no_wrap')).not.toHaveAttribute('_tolgee');
  });

  it('works with parameters', async () => {
    expect(screen.queryByTestId('peter_dogs')?.innerHTML).toContain('Petr má 5 psů.');
    expect(screen.queryByTestId('peter_dogs')).toHaveAttribute('_tolgee');
  });

  it('works with default value', async () => {
    expect(screen.queryByTestId('non_existant')?.innerHTML).toContain('Non existant');
    expect(screen.queryByTestId('non_existant')).toHaveAttribute('_tolgee');
  });

  it('works with language prop', () => {
    expect(screen.queryByTestId('with_language_prop')).toContainHTML('Hello world!');
    expect(screen.queryByTestId('with_language_prop')).toHaveAttribute('_tolgee');
  });

  describe('language switch', () => {
    beforeEach(async () => {
      await tolgee.changeLanguage('en');
    });

    it('changes translation with tags', async () => {
      expect(screen.queryByTestId('hello_world')?.innerHTML).toContain('Hello world!');
      expect(screen.queryByTestId('hello_world')).toHaveAttribute('_tolgee');
    });
  });
});
