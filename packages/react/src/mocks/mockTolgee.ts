import type { TolgeeInstance } from '@tolgee/core';
import type { Listener } from '@tolgee/core';

export const mockTolgee = () => {
  const runMock = {
    run: jest.fn(
      () =>
        new Promise(
          (resolve) => ((runMock.resolveRunPromise as unknown) = resolve)
        )
    ),
    resolveRunPromise: null as () => void | null,
  };

  const stopMock = jest.fn();
  let translationValue = 'translated';

  const changeTranslationValue = (value: string) => {
    translationValue = value;
  };

  const instantMock = jest.fn(
    (..._: Parameters<TolgeeInstance['t']> | unknown[]) => translationValue
  );
  const subscriptionCallbacks = {
    onTranslationChange: null,
    onLangChange: null,
  };

  const onTranslationChangeUnsubscribeMock = jest.fn();
  const onLangChangeUnsubscribeMock = jest.fn();

  const onTranslationChangeMock = {
    subscribe: jest.fn((callback) => {
      subscriptionCallbacks.onTranslationChange = callback;
      return {
        unsubscribe: onTranslationChangeUnsubscribeMock,
      } as unknown as Listener;
    }),
  };

  const onLangChangeMock = {
    subscribe: jest.fn((callback) => {
      subscriptionCallbacks.onLangChange = callback;
      return {
        unsubscribe: onLangChangeUnsubscribeMock,
      } as unknown as Listener;
    }),
  };

  const getLangMock = jest.fn(() => 'mocked-lang');
  const setLangMock = jest.fn();

  const tolgee = {
    init: () => tolgee as TolgeeInstance,
    run: runMock.run,
    stop: stopMock,
    getLanguage() {
      return getLangMock();
    },
    async changeLanguage(lang: string) {
      setLangMock(lang);
    },
    t: instantMock,
    isInitialLoading() {
      return true;
    },
  } as unknown as TolgeeInstance;

  const tolgeeClass = jest.fn().mockImplementation(() => tolgee);
  // @ts-ignore
  tolgeeClass.init = () => tolgee;
  // @ts-ignore
  tolgeeClass.use = () => tolgee;

  return {
    runMock,
    stopMock,
    instantMock,
    onTranslationChangeMock,
    onLangChangeMock,
    subscriptionCallbacks,
    onTranslationChangeUnsubscribeMock,
    onLangChangeUnsubscribeMock,
    getLangMock,
    setLangMock,
    changeTranslationValue,
    tolgeeClass,
    tolgee,
  };
};
