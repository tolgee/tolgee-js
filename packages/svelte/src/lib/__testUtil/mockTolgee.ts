/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import type { Tolgee } from '@tolgee/core';
import type { Subscription } from '@tolgee/core/lib/services/Subscription';

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
    (..._: Parameters<Tolgee['instant']> | unknown[]) => translationValue
  );
  const translateMock = jest.fn(
    async (..._: Parameters<Tolgee['translate']> | unknown[]) =>
      translationValue
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
  const changeLanguageMock = jest.fn();

  const tolgee = {
    init: () => tolgee as Tolgee,
    use: () => tolgee as Tolgee,
    run: runMock.run,
    stop: stopMock,
    get lang() {
      return getLangMock();
    },
    async changeLanguage(lang: string) {
      changeLanguageMock(lang);
    },
    instant: instantMock,
    translate: translateMock,
    onTranslationChange: onTranslationChangeMock,
    onLangChange: onLangChangeMock,
    initialLoading: true,
  } as Partial<Tolgee>;

  const tolgeeClass = jest.fn().mockImplementation(() => tolgee);
  (tolgeeClass as any).init = () => tolgee;
  (tolgeeClass as any).use = () => tolgee;

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
    setLangMock: changeLanguageMock,
    changeTranslationValue,
    tolgeeClass,
    tolgee,
  };
};
