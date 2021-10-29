import type { Tolgee } from '@tolgee/core';
import type { Subscription } from '@tolgee/core/lib/services/Subscription';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
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

  const instantMock = jest.fn(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (..._: Parameters<Tolgee['instant']> | unknown[]) => 'translated'
  );
  const translateMock = jest.fn(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async (..._: Parameters<Tolgee['translate']> | unknown[]) => 'translated'
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
      } as unknown as Subscription;
    }),
  };

  const onLangChangeMock = {
    subscribe: jest.fn((callback) => {
      subscriptionCallbacks.onLangChange = callback;
      return {
        unsubscribe: onLangChangeUnsubscribeMock,
      } as unknown as Subscription;
    }),
  };

  const getLangMock = jest.fn(() => 'mocked-lang');
  const setLangMock = jest.fn();

  return {
    runMock,
    stopMock,
    instantMock,
    translateMock,
    onTranslationChangeMock,
    onLangChangeMock,
    subscriptionCallbacks,
    onTranslationChangeUnsubscribeMock,
    onLangChangeUnsubscribeMock,
    getLangMock,
    setLangMock,
    tolgee: {
      run: runMock.run,
      stop: stopMock,
      get lang() {
        return getLangMock();
      },
      set lang(lang: string) {
        setLangMock(lang);
      },
      instant: instantMock,
      translate: translateMock,
      onTranslationChange: onTranslationChangeMock,
      onLangChange: onLangChangeMock,
    } as Partial<Tolgee>,
  };
};
