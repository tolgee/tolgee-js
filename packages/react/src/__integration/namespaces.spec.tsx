import { mockStaticDataAsync } from '@tolgee/testing/mockStaticData';
import React, { act } from 'react';
import '@testing-library/jest-dom';
import { DevTools, useTranslate } from '..';
import { render, screen, waitFor } from '@testing-library/react';
import { Tolgee, TolgeeInstance } from '@tolgee/web';
import { FormatIcu } from '@tolgee/format-icu';
import { GlobalContextPlugin } from '../GlobalContextPlugin';

jest.autoMockOff();

const API_URL = 'http://localhost';

describe('useTranslations namespaces', () => {
  let tolgee: TolgeeInstance;
  const TestComponent = () => {
    const { t, isLoading } = useTranslate('test');

    return (
      <>
        {isLoading && <div data-testid="loading">Loading...</div>}
        <div data-testid="test">{t('test')}</div>
        <div data-testid="test_english_fallback">
          {t('test_english_fallback')}
        </div>
        <div data-testid="non_existant">
          {t('non_existant', 'Non existant')}
        </div>
        <div data-testid="ns_fallback">{t('fallback', { ns: 'invalid' })}</div>
      </>
    );
  };

  let staticDataMock: ReturnType<typeof mockStaticDataAsync>;

  beforeEach(async () => {
    staticDataMock = mockStaticDataAsync();
    tolgee = Tolgee()
      .use(GlobalContextPlugin())
      .use(DevTools())
      .use(FormatIcu())
      .init({
        apiUrl: API_URL,
        language: 'cs',
        fallbackLanguage: 'en',
        fallbackNs: 'fallback',
        staticData: staticDataMock.promises,
      });

    await act(async () => {
      const runPromise = tolgee.run();
      staticDataMock.resolvePending();
      await runPromise;
      render(<TestComponent />);
    });
  });

  afterEach(() => {
    tolgee.stop();
  });

  it('loads namespace after render', async () => {
    expect(screen.queryByTestId('loading')).toContainHTML('Loading...');
    staticDataMock.resolvePending();
    await waitFor(() => {
      expect(screen.queryByTestId('loading')).toBeFalsy();
      expect(screen.queryByTestId('test')).toContainHTML('Český test');
      expect(screen.queryByTestId('test')).toHaveAttribute('_tolgee');
    });
  });

  it('works with english fallback', async () => {
    staticDataMock.resolvePending();
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
    staticDataMock.resolvePending();
    await waitFor(() => {
      expect(screen.queryByTestId('ns_fallback')).toContainHTML('Fallback');
      expect(screen.queryByTestId('ns_fallback')).toHaveAttribute('_tolgee');
    });
  });

  it('works with language and ns fallback', async () => {
    expect(screen.queryByTestId('ns_fallback')).toContainHTML(
      'Fallback fallback'
    );
    await act(async () => {
      const changePromise = tolgee.changeLanguage('en');
      staticDataMock.resolvePending();
      await changePromise;
    });
    expect(screen.queryByTestId('ns_fallback')).toContainHTML(
      'Fallback fallback'
    );
  });

  it('works with default value', async () => {
    staticDataMock.resolvePending();
    await waitFor(() => {
      expect(screen.queryByTestId('non_existant')).toContainHTML(
        'Non existant'
      );
      expect(screen.queryByTestId('non_existant')).toHaveAttribute('_tolgee');
    });
  });
});
