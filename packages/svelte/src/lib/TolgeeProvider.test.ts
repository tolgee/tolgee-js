/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Tolgee } from '@tolgee/core';
import { render, waitFor, screen } from '@testing-library/svelte';
import type { TolgeeInstance } from '@tolgee/core';
import { TolgeeProvider } from '$lib';
import TolgeeProviderSlotTestSvelte from './__testUtil/TolgeeProviderSlotTest.svelte';
import TolgeeProviderFallback from './__testUtil/TolgeeProviderFallback.svelte';

describe('TolgeeProvider', () => {
  let mockedTolgee: TolgeeInstance;

  beforeEach(() => {
    mockedTolgee = {
      ...Tolgee({ language: 'en' }),
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      run: jest.fn(() => new Promise<void>(() => {})),
      stop: jest.fn(),
    };
  });

  test('runs tolgee', async () => {
    render(TolgeeProvider, {
      tolgee: mockedTolgee,
    });
    expect(mockedTolgee.run).toHaveBeenCalledTimes(1);
  });

  test('stops tolgee', () => {
    const { unmount } = render(TolgeeProvider, {
      tolgee: mockedTolgee,
    });
    unmount();
    expect(mockedTolgee.stop).toHaveBeenCalledTimes(1);
  });

  test('renders fallback', async () => {
    render(TolgeeProviderFallback, {
      tolgee: mockedTolgee,
    });
    await waitFor(() => {
      expect(screen.getByText('loading')).not.toBeNull();
      expect(screen.queryByText("It's rendered!")).toBeNull();
    });
  });

  test("doesn't render fallback when initialLoading is false", async () => {
    render(TolgeeProviderFallback, {
      tolgee: { ...mockedTolgee, isLoaded: () => true },
    });
    await waitFor(async () => {
      screen.getByText("It's rendered!");
      expect(screen.queryByText('loading')).toBeNull();
    });
  });

  test('renders fallback with slot', async () => {
    render(TolgeeProviderSlotTestSvelte, {
      tolgee: mockedTolgee,
    });
    await waitFor(() => {
      expect(screen.getByText('loading')).not.toBeNull();
      expect(screen.queryByText("It's rendered!")).toBeNull();
    });
  });

  test("doesn't render fallback when initialLoading is false with slot", async () => {
    render(TolgeeProviderSlotTestSvelte, {
      tolgee: { ...mockedTolgee, isLoaded: () => true },
    });
    await waitFor(async () => {
      screen.getByText("It's rendered!");
      expect(screen.queryByText('loading')).toBeNull();
    });
  });
});
