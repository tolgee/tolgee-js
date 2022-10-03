jest.autoMockOff();

import { Tolgee, TolgeeInstance } from '@tolgee/web';

import '@testing-library/jest-dom';
import React from 'react';
import { TolgeeProvider } from './TolgeeProvider';

import { act, render, screen, waitFor } from '@testing-library/react';

describe('Tolgee Provider Component', () => {
  let mockedTolgee: TolgeeInstance;

  beforeEach(() => {
    mockedTolgee = {
      ...Tolgee({ language: 'en' }),
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

  test('stops tolgee', () => {
    const { unmount } = render(<TolgeeProvider tolgee={mockedTolgee} />);
    unmount();
    expect(mockedTolgee.stop).toHaveBeenCalledTimes(1);
  });

  test("doesn't render when everything is already fetched", async () => {
    const tolgee = Tolgee({
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
});
