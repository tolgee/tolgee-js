import '@testing-library/jest-dom';
import { SveltePlugin } from '..';
import Namespaces from './components/Namespaces.svelte';
import { render, screen, waitFor } from '@testing-library/svelte';
import { Tolgee, type TolgeeInstance } from '@tolgee/web';
import { FormatIcu } from '@tolgee/format-icu';
import { mockStaticDataAsync } from '@tolgee/testing/mockStaticData';

const API_URL = 'http://localhost';

describe('useTranslations namespaces', () => {
  let tolgee: TolgeeInstance;
  let staticDataMock: ReturnType<typeof mockStaticDataAsync>;

  beforeEach(async () => {
    staticDataMock = mockStaticDataAsync();
    tolgee = Tolgee().use(SveltePlugin()).use(FormatIcu()).init({
      apiUrl: API_URL,
      language: 'cs',
      fallbackLanguage: 'en',
      fallbackNs: 'fallback',
      staticData: staticDataMock.promises,
    });

    const runPromise = tolgee.run();
    staticDataMock.resolveAll();
    await runPromise;
    render(Namespaces);
  });

  it('loads namespace after render', async () => {
    expect(screen.queryByTestId('loading')).toContainHTML('Loading...');
    staticDataMock.resolveAll();
    await waitFor(() => {
      expect(screen.queryByTestId('loading')).toBeFalsy();
      expect(screen.queryByTestId('test')).toContainHTML('Český test');
      expect(screen.queryByTestId('test')).toHaveAttribute('_tolgee');
    });
  });

  it('works with english fallback', async () => {
    staticDataMock.resolveAll();
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
    expect(screen.queryByTestId('ns_fallback')).toContainHTML('fallback');
    staticDataMock.resolveAll();
    await waitFor(() => {
      expect(screen.queryByTestId('ns_fallback')).toContainHTML('Fallback');
      expect(screen.queryByTestId('ns_fallback')).toHaveAttribute('_tolgee');
    });
  });

  it('works with language and ns fallback', async () => {
    tolgee.changeLanguage('en');
    staticDataMock.resolveAll();
    await waitFor(() => {
      expect(screen.queryByTestId('ns_fallback')).toContainHTML('Fallback');
      expect(screen.queryByTestId('ns_fallback')).toHaveAttribute('_tolgee');
    });
  });

  it('works with default value', async () => {
    staticDataMock.resolveAll();
    await waitFor(() => {
      expect(screen.queryByTestId('non_existant')).toContainHTML(
        'Non existant'
      );
      expect(screen.queryByTestId('non_existant')).toHaveAttribute('_tolgee');
    });
  });
});
