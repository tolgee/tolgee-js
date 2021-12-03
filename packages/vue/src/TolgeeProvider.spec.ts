jest.dontMock('./mocks/ProviderComponent.vue');
jest.dontMock('./mocks/ProviderComponentSlot.vue');
jest.dontMock('./mocks/ComponentUsingProvider.vue');
jest.dontMock('./TolgeeProvider');
jest.dontMock('./mocks/mockTolgee');

jest.mock('@tolgee/core');

import * as tolgee from '@tolgee/core';

import { render, screen, waitFor } from '@testing-library/vue';
import { mockTolgee } from './mocks/mockTolgee';
import ProviderComponent from './mocks/ProviderComponent.vue';
import ProviderComponentSlot from './mocks/ProviderComponentSlot.vue';

describe('Tolgee Provider Component', function () {
  let mockedTolgee: ReturnType<typeof mockTolgee>;
  beforeEach(async () => {
    mockedTolgee = mockTolgee();
    // @ts-ignore
    tolgee.Tolgee = mockedTolgee.tolgeeClass;
    jest.clearAllMocks();
  });

  test('provides context', async () => {
    render(ProviderComponent, { props: { config: {} } });
    await waitFor(() => {
      screen.getByText("It's rendered!");
      screen.getByText('mocked-lang');
    });
  });

  test('runs tolgee', async () => {
    render(ProviderComponent, {
      props: { config: {} },
    });
    expect(mockedTolgee.tolgee.run).toHaveBeenCalledTimes(1);
  });

  test('stops tolgee', () => {
    const { unmount } = render(ProviderComponent, {
      props: { config: {}, loadingFallback: 'loading' },
    });
    unmount();
    expect(mockedTolgee.tolgee.stop).toHaveBeenCalledTimes(1);
  });

  test('renders loadingFallback', async () => {
    // @ts-ignore
    mockedTolgee.tolgee.initialLoading = true;
    render(ProviderComponent, {
      props: { config: {}, loadingFallback: 'loading' },
    });
    await waitFor(() => {
      screen.getByText('loading');
    });
  });

  test('renders loadingFallback with slot', async () => {
    // @ts-ignore
    mockedTolgee.tolgee.initialLoading = true;
    render(ProviderComponentSlot, {
      props: { config: {} },
    });
    await waitFor(() => {
      screen.getByText('loading');
      const rendered = screen.queryByText("It's rendered!");
      expect(rendered).toBeNull();
    });
  });

  test("doesn't render loadingFallback when initialLoading is false", async () => {
    // @ts-ignore
    mockedTolgee.tolgee.initialLoading = false;
    render(ProviderComponent, {
      props: { config: {}, loadingFallback: 'loading' },
    });
    await waitFor(async () => {
      screen.getByText("It's rendered!");
      const loading = screen.queryByText('loading');
      expect(loading).toBeNull();
    });
  });
});
