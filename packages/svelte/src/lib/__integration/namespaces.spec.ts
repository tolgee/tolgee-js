import '@testing-library/jest-dom';
import { SveltePlugin } from '..';
import Namespaces from './components/Namespaces.svelte';
import { render, screen, waitFor } from '@testing-library/svelte';
import { Tolgee, type TolgeeInstance } from '@tolgee/web';
import { FormatIcu } from '@tolgee/format-icu';

import mockTranslations from './data/mockTranslations';

const API_URL = 'http://localhost';

let pending = [] as (() => void)[];
const resolvePending = () => {
  pending.forEach((resolve) => resolve());
  pending = [];
};

const wrapInPromise =
  <T>(data: T) =>
  () =>
    new Promise<T>((resolve) => pending.push(() => resolve(data)));

describe('useTranslations namespaces', () => {
  let tolgee: TolgeeInstance;

  beforeEach(async () => {
    tolgee = Tolgee()
      .use(SveltePlugin())
      .use(FormatIcu())
      .init({
        apiUrl: API_URL,
        language: 'cs',
        fallbackLanguage: 'en',
        staticData: {
          cs: wrapInPromise(mockTranslations.cs),
          'cs:test': wrapInPromise(mockTranslations['cs:test']),
          en: wrapInPromise(mockTranslations.en),
          'en:test': wrapInPromise(mockTranslations['en:test']),
        },
      });

    const runPromise = tolgee.run();
    resolvePending();
    await runPromise;
    render(Namespaces);
  });

  it('loads namespace after render', async () => {
    expect(screen.queryByTestId('loading')).toContainHTML('Loading...');
    resolvePending();
    await waitFor(() => {
      expect(screen.queryByTestId('loading')).toBeFalsy();
      expect(screen.queryByTestId('test')).toContainHTML('Český test');
      expect(screen.queryByTestId('test')).toHaveAttribute('_tolgee');
    });
  });

  it('works with english fallback', async () => {
    resolvePending();
    await waitFor(() => {
      expect(screen.queryByTestId('test_english_fallback')).toContainHTML(
        'Test english fallback'
      );
      expect(screen.queryByTestId('test_english_fallback')).toHaveAttribute(
        '_tolgee'
      );
    });
  });

  it('works with ns fallback', async () => {
    expect(screen.queryByTestId('ns_double_fallback')).toContainHTML(
      'test_english_fallback'
    );
    resolvePending();
    await waitFor(() => {
      expect(screen.queryByTestId('ns_double_fallback')).toContainHTML(
        'Test english fallback'
      );
      expect(screen.queryByTestId('ns_double_fallback')).toHaveAttribute(
        '_tolgee'
      );
    });
  });

  it('works with language and ns fallback', async () => {
    expect(screen.queryByTestId('ns_double_fallback')).toContainHTML(
      'test_english_fallback'
    );
    resolvePending();
    await waitFor(() => {
      expect(screen.queryByTestId('ns_double_fallback')).toContainHTML(
        'Test english fallback'
      );
      expect(screen.queryByTestId('ns_double_fallback')).toHaveAttribute(
        '_tolgee'
      );
    });
  });

  it('works with default value', async () => {
    resolvePending();
    await waitFor(() => {
      expect(screen.queryByTestId('non_existant')).toContainHTML(
        'Non existant'
      );
      expect(screen.queryByTestId('non_existant')).toHaveAttribute('_tolgee');
    });
  });
});
