jest.autoMockOff();

import { Tolgee, TolgeeInstance, TolgeePlugin } from '@tolgee/web';

import '@testing-library/jest-dom';
import React, { act } from 'react';
import { TolgeeProvider } from './TolgeeProvider';

import { render, screen, waitFor } from '@testing-library/react';
import { createResolvablePromise } from '@tolgee/testing/createResolvablePromise';

describe('Tolgee Provider Component', () => {
  let mockedTolgee: TolgeeInstance;

  beforeEach(() => {
    mockedTolgee = {
      ...Tolgee().init({ language: 'en' }),
      run: jest.fn(() => new Promise<void>(() => {})),
      stop: jest.fn(),
    };
  });

  test('renders loadingFallback', async () => {
    act(() => {
      render(
        <TolgeeProvider
          tolgee={mockedTolgee}
          fallback={<>loading</>}
          options={{ useSuspense: false }}
        />
      );
    });
    await waitFor(() => {
      screen.getByText('loading');
    });
  });

  test('runs tolgee', async () => {
    act(() => {
      render(<TolgeeProvider tolgee={mockedTolgee} fallback="loading" />);
    });
    expect(mockedTolgee.run).toHaveBeenCalledTimes(1);
  });

  test("doesn't render when everything is already fetched", async () => {
    const tolgee = Tolgee().init({
      language: 'en',
      staticData: {
        en: {},
      },
    });
    act(() => {
      render(
        <TolgeeProvider tolgee={tolgee} fallback={<>loading</>}>
          It's rendered!
        </TolgeeProvider>
      );
    });
    await waitFor(async () => {
      screen.getByText("It's rendered!");
      const loading = screen.queryByText('loading');
      expect(loading).toBeNull();
    });
  });

  test('renders fallback when language is being fetched', async () => {
    const language = createResolvablePromise('en');

    const storagePlugin: TolgeePlugin = (tolgee, { setLanguageStorage }) => {
      setLanguageStorage({
        getLanguage() {
          return language.promise;
        },
        setLanguage() {},
      });
      return tolgee;
    };
    const tolgee = Tolgee()
      .use(storagePlugin)
      .init({
        defaultLanguage: 'en',
        staticData: {
          en: {},
        },
      });
    render(
      <TolgeeProvider tolgee={tolgee} fallback="Loading...">
        It's rendered!
      </TolgeeProvider>
    );
    await waitFor(async () => {
      expect(screen.getByText('Loading...')).toBeTruthy();
    });
    await act(async () => {
      language.resolve();
      await language.promise;
    });
    expect(screen.getByText("It's rendered!")).toBeTruthy();
  });
});
