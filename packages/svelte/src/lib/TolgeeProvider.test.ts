import { Tolgee } from '@tolgee/web';
import { render, waitFor, screen } from '@testing-library/svelte';
import { vi } from 'vitest';
import type { TolgeeInstance } from '@tolgee/web';
import { TolgeeProvider } from '$lib';
import TolgeeProviderSlotTestSvelte from './__testUtil/TolgeeProviderSlotTest.svelte';
import TolgeeProviderFallback from './__testUtil/TolgeeProviderFallback.svelte';

describe('TolgeeProvider', () => {
  let mockedTolgee: TolgeeInstance;

  beforeEach(() => {
    mockedTolgee = {
      ...Tolgee().init({ language: 'en' }),
      run: vi.fn(() => new Promise<void>(() => {})),
      stop: vi.fn()
    };
  });

  test('runs tolgee', async () => {
    render(TolgeeProvider, {
      tolgee: mockedTolgee
    });
    expect(mockedTolgee.run).toHaveBeenCalledTimes(1);
  });

  test('stops tolgee', () => {
    const { unmount } = render(TolgeeProvider, {
      tolgee: mockedTolgee
    });
    unmount();
    expect(mockedTolgee.stop).toHaveBeenCalledTimes(1);
  });

  test('renders fallback', async () => {
    render(TolgeeProviderFallback, {
      tolgee: mockedTolgee
    });
    await waitFor(() => {
      expect(screen.getByText('loading')).not.toBeNull();
      expect(screen.queryByText("It's rendered!")).toBeNull();
    });
  });

  test("doesn't render fallback when initialLoading is false", async () => {
    render(TolgeeProviderFallback, {
      tolgee: { ...mockedTolgee, isLoaded: () => true }
    });
    await waitFor(async () => {
      screen.getByText("It's rendered!");
      expect(screen.queryByText('loading')).toBeNull();
    });
  });

  test('renders fallback with slot', async () => {
    render(TolgeeProviderSlotTestSvelte, {
      tolgee: mockedTolgee
    });
    await waitFor(() => {
      expect(screen.getByText('loading')).not.toBeNull();
      expect(screen.queryByText("It's rendered!")).toBeNull();
    });
  });

  test("doesn't render fallback when initialLoading is false with slot", async () => {
    render(TolgeeProviderSlotTestSvelte, {
      tolgee: { ...mockedTolgee, isLoaded: () => true }
    });
    await waitFor(async () => {
      screen.getByText("It's rendered!");
      expect(screen.queryByText('loading')).toBeNull();
    });
  });
});
