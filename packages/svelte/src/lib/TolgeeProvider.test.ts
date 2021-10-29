import { render } from '@testing-library/svelte';
import { TolgeeProvider } from '$lib/index';
import TolgeeProviderSlotTest from '$lib/__testUtil/TolgeeProviderSlotTest.svelte';
import { mockTolgee } from '$lib/__testUtil/mockTolgee';

const setContextMock = jest.fn();
const tolgeeMock = mockTolgee();

let onMountCallback;
let onDestroyCallback;

jest.mock('@tolgee/core', () => ({
  Tolgee: function () {
    return tolgeeMock.tolgee;
  },
  TolgeeConfig: function () {
    jest.fn();
  },
}));
jest.mock('svelte', () => {
  return {
    ...(jest.requireActual('svelte') as Record<string, unknown>),
    setContext: (...args) => setContextMock(...args),
    onMount: (callback) => (onMountCallback = callback),
    onDestroy: (callback) => (onDestroyCallback = callback),
  };
});

describe('TolgeeProvider', () => {
  describe('on start', () => {
    beforeEach(() => {
      render(TolgeeProvider, {
        props: {
          config: {},
        },
      });
    });

    it('sets context', () => {
      expect(setContextMock).toHaveBeenCalledTimes(1);
      expect(setContextMock).toHaveBeenCalledWith('tolgeeContext', {
        tolgee: tolgeeMock.tolgee,
      });
    });

    it('runs on mount', () => {
      expect(tolgeeMock.runMock.run).toHaveBeenCalledTimes(0);
      onMountCallback();
      expect(tolgeeMock.runMock.run).toHaveBeenCalledTimes(1);
    });

    it('stops on destroy', () => {
      expect(tolgeeMock.stopMock).toHaveBeenCalledTimes(0);
      onDestroyCallback();
      expect(tolgeeMock.stopMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('slots', () => {
    describe('with initialLoading true', () => {
      let findByText;

      beforeEach(() => {
        (tolgeeMock.tolgee.initialLoading as boolean) = true;
        findByText = render(TolgeeProviderSlotTest, {}).findByText;
        onMountCallback();
      });

      it('shows loading fallback slot when loading', async () => {
        expect(await findByText('Custom loading fallback')).toBeInTheDocument();
      });

      it('shows content when loaded', async () => {
        tolgeeMock.runMock.resolveRunPromise();
        expect(await findByText('Default slot')).toBeInTheDocument();
      });
    });

    it('shows default when initialLoading is false', async () => {
      (tolgeeMock.tolgee.initialLoading as boolean) = false;
      const { findByText } = render(TolgeeProviderSlotTest, {});
      expect(await findByText('Default slot')).toBeInTheDocument();
    });
  });
});
