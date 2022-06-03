import '@testing-library/jest-dom';
import getTranslate from '$lib/getTranslate';
import { mockTolgee } from '$lib/__testUtil/mockTolgee';
import { waitFor } from '@testing-library/svelte';
import clearAllMocks = jest.clearAllMocks;

const tolgeeMock = mockTolgee();

jest.mock('./getTolgeeContext', () => () => ({
  tolgee: tolgeeMock.tolgee,
}));

let onDestroyCallback: () => void;

jest.mock('svelte', () => ({
  onDestroy: (callback: () => void) => (onDestroyCallback = callback),
  tick: jest.fn(),
}));

describe('getTranslate', () => {
  beforeEach(() => {
    clearAllMocks();
  });

  it('translates', () => {
    const readable = getTranslate();

    readable.subscribe((t) => {
      expect(t('hello')).toEqual('translated');
    });

    expect(tolgeeMock.instantMock).toHaveBeenCalledTimes(1);
    expect(tolgeeMock.translateMock).toHaveBeenCalledTimes(1);
  });

  describe('t with with props object', () => {
    const tPropsArray = [
      {
        key: 'test-key',
        defaultValue: 'This is default',
        noWrap: false,
        parameters: { param: 'value' },
      },
      {
        key: 'test-key-2',
        defaultValue: 'This is default 2',
        noWrap: true,
        parameters: { param: 'value2' },
      },
    ];

    const assertAllInstantCallsParams = () =>
      tPropsArray.forEach((tProps) => {
        const { parameters, ...restTProps } = tProps;
        expect(tolgeeMock.instantMock).toHaveBeenCalledWith({
          ...restTProps,
          params: parameters,
        });
      });

    const assertAllTranslateCallsParams = () =>
      tPropsArray.forEach((tProps) => {
        const { parameters, ...restTProps } = tProps;
        expect(tolgeeMock.translateMock).toHaveBeenCalledWith({
          ...restTProps,
          params: parameters,
          key: restTProps.key,
        });
      });

    const translateSubscription = jest.fn((t) => {
      tPropsArray.forEach((tProps) => {
        expect(t(tProps)).toEqual('translated');
      });
    });

    beforeEach(() => {
      const readable = getTranslate();

      readable.subscribe(translateSubscription);
    });

    it('called the instant method', () => {
      expect(tolgeeMock.instantMock).toHaveBeenCalledTimes(tPropsArray.length);
    });

    it('called the translate method', () => {
      expect(tolgeeMock.translateMock).toHaveBeenCalledTimes(
        tPropsArray.length
      );
    });

    it('called instant called with proper params', () => {
      assertAllInstantCallsParams();
    });

    it('called translate called with proper params', () => {
      assertAllTranslateCallsParams();
    });

    it('subscribed for langChange correctly', async () => {
      expect(tolgeeMock.onLangChangeMock.subscribe).toHaveBeenCalledTimes(1);
      jest.clearAllMocks();
      tolgeeMock.subscriptionCallbacks.onLangChange();
      await waitFor(() => {
        expect(tolgeeMock.translateMock).toHaveBeenCalledTimes(
          tPropsArray.length + 1
        );
        expect(tolgeeMock.translateMock).toBeCalledWith('key');
        assertAllTranslateCallsParams();
      });
    });

    it('subscribed for translationChange correctly', async () => {
      expect(
        tolgeeMock.onTranslationChangeMock.subscribe
      ).toHaveBeenCalledTimes(1);
      jest.clearAllMocks();
      tolgeeMock.subscriptionCallbacks.onTranslationChange({
        key: tPropsArray[1].key,
      });

      await waitFor(() => {
        expect(translateSubscription).toHaveBeenCalledTimes(1);
        expect(tolgeeMock.translateMock).toHaveBeenCalledTimes(
          // for every subscribed key, there should be new call
          tPropsArray.length
        );
        assertAllTranslateCallsParams();
      });
    });

    it('unsubscribes on destroy', () => {
      onDestroyCallback();
      expect(tolgeeMock.onLangChangeUnsubscribeMock).toHaveBeenCalledTimes(1);
      expect(
        tolgeeMock.onTranslationChangeUnsubscribeMock
      ).toHaveBeenCalledTimes(1);
    });
  });

  it('passes the params correctly', () => {
    const readable = getTranslate();

    const tProps = {
      key: 'test-key',
      defaultValue: 'This is default',
      noWrap: false,
      params: { param: 'value' },
    };

    readable.subscribe((t) => {
      expect(
        t(tProps.key, tProps.params, tProps.noWrap, tProps.defaultValue)
      ).toEqual('translated');
    });

    expect(tolgeeMock.translateMock).toHaveBeenCalledWith(tProps);
    expect(tolgeeMock.instantMock).toHaveBeenCalledWith({
      ...tProps,
    });
  });
});
