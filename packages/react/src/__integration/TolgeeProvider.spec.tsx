import React, { act } from 'react';
import '@testing-library/jest-dom';
import {
  DevTools,
  Tolgee,
  TolgeeInstance,
  TolgeeProvider,
  useTranslate,
} from '..';
import { render, screen, waitFor } from '@testing-library/react';
import { mockCoreFetchAsync } from '@tolgee/testing/fetchMock';

const API_URL = 'http://localhost';
const API_KEY = 'dummyApiKey';

describe('TolgeeProvider integration', () => {
  const TestComponent = () => {
    const { t } = useTranslate();
    return (
      <>
        <div data-testid="hello_world">{t('hello_world')}</div>
        <div data-testid="english_fallback">
          {t('english_fallback', 'Default value')}
        </div>
        <div data-testid="non_existant">
          {t('non_existant', 'Default value')}
        </div>
      </>
    );
  };

  describe('regular settings', () => {
    let resolveEnglish: any;
    let resolveCzech: any;
    let tolgee: TolgeeInstance;

    beforeEach(async () => {
      const fetchMock = mockCoreFetchAsync();
      resolveCzech = fetchMock.csTranslations.resolve;
      resolveEnglish = fetchMock.enTranslations.resolve;
      fetchMock.fetch.enableMocks();
      tolgee = Tolgee().use(DevTools()).init({
        apiUrl: API_URL,
        apiKey: API_KEY,
        language: 'cs',
        fallbackLanguage: 'en',
      });

      act(() => {
        render(
          <TolgeeProvider tolgee={tolgee} fallback="Loading...">
            <TestComponent />
          </TolgeeProvider>
        );
      });
    });

    afterEach(() => {
      tolgee.stop();
    });

    it('shows correctly loading, fallback and default value', async () => {
      expect(screen.queryByText('Loading...')).toBeInTheDocument();
      act(() => {
        resolveCzech();
      });
      await waitFor(() => {
        expect(screen.queryByText('Loading...')).toBeInTheDocument();
      });
      act(() => {
        resolveEnglish();
      });
      await waitFor(() => {
        expect(screen.queryByTestId('hello_world')).toContainHTML(
          'Ahoj světe!'
        );
        expect(screen.queryByTestId('english_fallback')).toContainHTML(
          'English fallback'
        );
        expect(screen.queryByTestId('non_existant')).toContainHTML(
          'Default value'
        );
      });
    });
  });

  describe('with fallback', () => {
    let resolveEnglish: any;
    let resolveCzech: any;
    let tolgee: TolgeeInstance;

    beforeEach(async () => {
      const fetchMock = mockCoreFetchAsync();
      resolveCzech = fetchMock.csTranslations.resolve;
      resolveEnglish = fetchMock.enTranslations.resolve;
      fetchMock.fetch.enableMocks();
      tolgee = Tolgee().use(DevTools()).init({
        apiUrl: API_URL,
        apiKey: API_KEY,
        language: 'cs',
        fallbackLanguage: 'en',
      });
      act(() => {
        render(
          <TolgeeProvider tolgee={tolgee} fallback="Loading...">
            <TestComponent />
          </TolgeeProvider>
        );
      });
    });

    it('shows correctly loading, fallback and default value', async () => {
      expect(screen.queryByText('Loading...')).toBeInTheDocument();
      act(() => {
        resolveCzech();
      });
      await waitFor(() => {
        expect(screen.queryByText('Loading...')).toBeInTheDocument();
        expect(screen.queryByTestId('hello_world')).not.toBeInTheDocument();
      });
      act(() => {
        resolveEnglish();
      });
      await waitFor(() => {
        expect(screen.queryByTestId('hello_world')).toContainHTML(
          'Ahoj světe!'
        );
        expect(screen.queryByTestId('english_fallback')).toContainHTML(
          'English fallback'
        );
        expect(screen.queryByTestId('non_existant')).toContainHTML(
          'Default value'
        );
      });
    });
  });
});
