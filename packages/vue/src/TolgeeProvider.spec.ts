import { render, screen, waitFor } from '@testing-library/vue';
import ProviderComponent from './mocks/ProviderComponent.vue';
import ProviderComponentSlot from './mocks/ProviderComponentSlot.vue';
import { TolgeeInstance, Tolgee } from '@tolgee/web';
import { VueTolgee } from '.';

describe('Tolgee Provider Component', function () {
  let mockedTolgee: TolgeeInstance;

  beforeEach(() => {
    mockedTolgee = {
      ...Tolgee().init({ language: 'en' }),
      run: jest.fn(() => new Promise<void>(() => {})),
      stop: jest.fn(),
    };
  });

  test('provides context', async () => {
    render(ProviderComponent, {
      props: {
        tolgee: {
          ...mockedTolgee,
          isLoaded: () => true,
          getLanguage: () => 'mocked-lang',
        },
      },
      global: { plugins: [[VueTolgee, { tolgee: mockedTolgee }]] },
    });
    await waitFor(() => {
      screen.getByText("It's rendered!");
      screen.getByText('mocked-lang');
    });
  });

  test('runs tolgee', async () => {
    render(ProviderComponent, {
      props: { tolgee: mockedTolgee },
      global: { plugins: [[VueTolgee, { tolgee: mockedTolgee }]] },
    });
    expect(mockedTolgee.run).toHaveBeenCalledTimes(1);
  });

  test('stops tolgee', () => {
    const { unmount } = render(ProviderComponent, {
      props: { tolgee: mockedTolgee },
      global: { plugins: [[VueTolgee, { tolgee: mockedTolgee }]] },
    });
    unmount();
    expect(mockedTolgee.stop).toHaveBeenCalledTimes(1);
  });

  test('renders fallback with slot', async () => {
    render(ProviderComponentSlot, {
      props: { tolgee: mockedTolgee },
      global: { plugins: [[VueTolgee, { tolgee: mockedTolgee }]] },
    });
    await waitFor(() => {
      screen.getByText('loading');
      const rendered = screen.queryByText("It's rendered!");
      expect(rendered).toBeNull();
    });
  });

  test("doesn't render fallback when initialLoading is false", async () => {
    render(ProviderComponent, {
      props: {
        tolgee: { ...mockedTolgee, isLoaded: () => true },
        fallback: 'loading',
      },
      global: { plugins: [[VueTolgee, { tolgee: mockedTolgee }]] },
    });
    await waitFor(async () => {
      screen.getByText("It's rendered!");
      const loading = screen.queryByText('loading');
      expect(loading).toBeNull();
    });
  });
});
