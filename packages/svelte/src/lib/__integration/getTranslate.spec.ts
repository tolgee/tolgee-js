import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/svelte';

import TestTranslateComponent from './components/TestTranslateComponent.svelte';
import { Tolgee, DevTools, type TolgeeInstance } from '@tolgee/web';
import { FormatIcu } from '@tolgee/format-icu';
import { mockCoreFetch } from './mockCoreFetch';

const API_URL = 'http://localhost';
const API_KEY = 'dummyApiKey';

describe('getTranslate', () => {
  let tolgee: TolgeeInstance;
  beforeEach(async () => {
    const fetchMock = mockCoreFetch();
    fetchMock.resolveAll();
    fetchMock.fetch.enableMocks();

    tolgee = Tolgee().use(DevTools()).use(FormatIcu()).init({
      apiKey: API_KEY,
      apiUrl: API_URL,
      defaultLanguage: 'cs',
      fallbackLanguage: 'en'
    });

    render(TestTranslateComponent, {
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

  it('works with no wrap', () => {
    expect(screen.queryByTestId('hello_world_no_wrap')?.innerHTML).toContain('Ahoj světe!');
    expect(screen.queryByTestId('hello_world_no_wrap')).not.toHaveAttribute('_tolgee');
  });

  it('works with parameters', () => {
    expect(screen.queryByTestId('peter_dogs')?.innerHTML).toContain('Petr má 5 psů.');
    expect(screen.queryByTestId('peter_dogs')).toHaveAttribute('_tolgee');
  });

  it('works with default value', async () => {
    expect(screen.queryByTestId('non_existant')?.innerHTML).toContain('Non existant');
    expect(screen.queryByTestId('non_existant')).toHaveAttribute('_tolgee');
  });

  describe('language switch', () => {
    beforeEach(async () => {
      await tolgee.changeLanguage('en');
    });

    it('changes translation', () => {
      expect(screen.queryByTestId('hello_world')?.innerHTML).toContain('Hello world!');
      expect(screen.queryByTestId('hello_world')).toHaveAttribute('_tolgee');
    });
  });
});
