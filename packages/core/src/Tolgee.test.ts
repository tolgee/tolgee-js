jest.dontMock('./Tolgee');
jest.dontMock('./services/DependencyStore');

import '@testing-library/jest-dom/extend-expect';
import { mocked } from 'ts-jest/utils';
import { CoreService } from './services/CoreService';
import Tolgee from './Tolgee';
import {
  configMock,
  coreServiceMock,
  eventEmitterMock,
  eventServiceMock,
  getMockedInstance,
  observerMock,
  propertiesMock,
  textServiceMock,
  translationServiceMock,
} from '@testFixtures/mocked';
import { EventEmitterImpl } from './services/EventEmitter';
import { Scope } from './types';
import { TextService } from './services/TextService';
import { CoreHandler } from './handlers/CoreHandler';
import { ElementRegistrar } from './services/ElementRegistrar';
import { NodeHelper } from './helpers/NodeHelper';
import { TOLGEE_TARGET_ATTRIBUTE } from './Constants/Global';
import { Properties } from './Properties';

describe('Tolgee', () => {
  let tolgee: Tolgee;

  beforeEach(() => {
    jest.clearAllMocks();
    tolgee = new Tolgee({});
  });

  test('can be created', () => {
    expect(tolgee).not.toBeNull();
  });

  test('returns proper default language', () => {
    configMock.mock.instances[0].defaultLanguage = 'testDefaultLanguage';
    expect(configMock).toBeCalledTimes(1);
    expect(tolgee.defaultLanguage).toEqual('testDefaultLanguage');
  });

  test('returns proper language', () => {
    propertiesMock.mock.instances[0].currentLanguage = 'currentLang';
    expect(tolgee.lang).toEqual('currentLang');
  });

  test('returns instance of tolgee service', () => {
    expect(tolgee.coreService instanceof CoreService).toBeTruthy();
  });

  test('will set properties.scopes on run in development mode', async () => {
    propertiesMock.mock.instances[0].config.mode = 'development';
    await tolgee.run();
    expect(coreServiceMock.mock.instances[0].getApiKeyDetails).toBeCalledTimes(
      1
    );
    expect(propertiesMock.mock.instances[0].scopes).toContain(
      'translations.edit' as Scope
    );
    expect(propertiesMock.mock.instances[0].scopes).not.toContain(
      'translations.view' as Scope
    );
  });

  test('will set properties.projectId on run in development mode', async () => {
    propertiesMock.mock.instances[0].config.mode = 'development';
    await tolgee.run();
    expect(propertiesMock.mock.instances[0].projectId).toEqual(0);
  });

  test('will not set properties.scopes on run in production mode', async () => {
    propertiesMock.mock.instances[0].config.mode = 'production';
    await tolgee.run();
    expect(coreServiceMock.mock.instances[0].getApiKeyDetails).toBeCalledTimes(
      0
    );
    expect(propertiesMock.mock.instances[0].scopes).toBeUndefined();
  });

  test('will run the observer when watch is on', async () => {
    propertiesMock.mock.instances[0].config.watch = true;
    await tolgee.run();
    expect(observerMock.mock.instances[0].observe).toBeCalledTimes(1);
  });

  test('will not the observer when watch is off', async () => {
    propertiesMock.mock.instances[0].config.watch = false;
    await tolgee.run();
    expect(observerMock.mock.instances[0].observe).toBeCalledTimes(0);
  });

  test('will try to get translations with current language from properties', async () => {
    propertiesMock.mock.instances[0].currentLanguage = 'dummyLang';
    await tolgee.run();
    expect(
      translationServiceMock.mock.instances[0].loadTranslations
    ).toBeCalledWith();
  });

  test('will try to get translations with current language from properties', async () => {
    propertiesMock.mock.instances[0].currentLanguage = 'dummyLang';
    propertiesMock.mock.instances[0].config.preloadFallback = true;
    propertiesMock.mock.instances[0].config.fallbackLanguage = 'fallbackLang';
    await tolgee.run();
    expect(
      translationServiceMock.mock.instances[0].loadTranslations
    ).toBeCalledWith();
    expect(
      translationServiceMock.mock.instances[0].loadTranslations
    ).toBeCalledWith('fallbackLang');
  });

  test('will refresh translations using observer on run', async () => {
    const htmlElement = document.createElement('dummyElement');
    propertiesMock.mock.instances[0].config.targetElement = htmlElement;
    await tolgee.run();
    expect(getMockedInstance(CoreHandler).handleSubtree).toBeCalledWith(
      htmlElement
    );
  });

  test('will refresh translations using observer on refresh', async () => {
    const htmlElement = document.createElement('dummyElement');
    propertiesMock.mock.instances[0].config.targetElement = htmlElement;
    await tolgee.refresh();
    expect(getMockedInstance(CoreHandler).handleSubtree).toBeCalledWith(
      htmlElement
    );
  });

  test('will get defaultLanguage from config', async () => {
    propertiesMock.mock.instances[0].config.defaultLanguage = 'dummyLang';
    expect(tolgee.defaultLanguage).toEqual('dummyLang');
  });

  describe('translation functions', () => {
    const translatedDummyText = 'translatedDummyText';
    const wrappedDummyText = 'wrappedDummyText';
    const dummyKey = 'dummyText';
    let mockedTranslate;
    let mockedInstant;
    let mockedWrap;
    let mockedLoadTranslations;
    const dummyParams = {};

    beforeEach(() => {
      mockedTranslate = mocked(textServiceMock.mock.instances[0].translate);
      mockedInstant = mocked(textServiceMock.mock.instances[0].instant);
      mockedWrap = mocked(textServiceMock.mock.instances[0].wrap);
      mockedLoadTranslations = mocked(
        translationServiceMock.mock.instances[0].loadTranslations
      );
      mockedTranslate.mockImplementation(async () => translatedDummyText);
      mockedInstant.mockImplementation(() => translatedDummyText);
      mockedWrap.mockImplementation(() => wrappedDummyText);
    });

    describe('async translate', () => {
      test('will return wrapped string from text service in development mode', async () => {
        propertiesMock.mock.instances[0].config.mode = 'development';
        const translated = await tolgee.translate(dummyKey, dummyParams);

        expect(mockedWrap).toBeCalledWith(dummyKey, dummyParams, undefined);
        expect(mockedTranslate).not.toBeCalled();
        expect(translated).toEqual(wrappedDummyText);
      });

      test('will return translated string from text service in production mode', async () => {
        propertiesMock.mock.instances[0].config.mode = 'production';
        const translated = await tolgee.translate(dummyKey, dummyParams);

        expect(translated).toEqual(translatedDummyText);
        expect(mockedWrap).not.toBeCalled();
        expect(mockedTranslate).toBeCalledWith(
          dummyKey,
          dummyParams,
          undefined,
          undefined,
          undefined
        );
      });

      test('will not wrap when development is on, but noWrap is true', async () => {
        propertiesMock.mock.instances[0].config.mode = 'development';
        const translated = await tolgee.translate(dummyKey, dummyParams, true);

        expect(mockedWrap).not.toBeCalled();
        expect(translated).toEqual(translatedDummyText);
      });

      test('will wait for translations load before wrapping', async () => {
        propertiesMock.mock.instances[0].config.mode = 'development';
        await tolgee.translate(dummyKey, dummyParams);
        expect(mockedLoadTranslations).toBeCalled();
      });

      test('passes default value to wrap fn', async () => {
        propertiesMock.mock.instances[0].config.mode = 'development';
        await tolgee.translate(dummyKey, dummyParams, false, 'Default');
        expect(mockedWrap).toBeCalledWith('dummyText', {}, 'Default');
      });

      test('passes default value to translate fn', async () => {
        propertiesMock.mock.instances[0].config.mode = 'development';
        await tolgee.translate(dummyKey, dummyParams, true, 'Default');
        expect(mockedTranslate).toBeCalledWith(
          'dummyText',
          {},
          undefined,
          undefined,
          'Default'
        );
      });

      test('props object works correctly', async () => {
        propertiesMock.mock.instances[0].config.mode = 'development';
        await tolgee.translate({
          key: dummyKey,
          params: dummyParams,
          noWrap: true,
          defaultValue: 'Default',
        });
        expect(mockedTranslate).toBeCalledWith(
          dummyKey,
          dummyParams,
          undefined,
          undefined,
          'Default'
        );
      });

      test('passes orEmpty correctly', async () => {
        propertiesMock.mock.instances[0].config.mode = 'development';
        await tolgee.translate({
          key: dummyKey,
          params: dummyParams,
          noWrap: true,
          orEmpty: true,
        });
        expect(mockedTranslate).toBeCalledWith(
          dummyKey,
          dummyParams,
          undefined,
          true,
          undefined
        );
      });
    });

    describe('sync instant', () => {
      test('will return wrapped string from text service in development mode', async () => {
        propertiesMock.mock.instances[0].config.mode = 'development';
        const dummyParams = {};
        const translated = tolgee.instant(dummyKey, dummyParams);

        expect(mockedWrap).toBeCalledWith(dummyKey, dummyParams, undefined);
        expect(mockedInstant).not.toBeCalled();
        expect(translated).toEqual(wrappedDummyText);
      });

      test('will return translated string from text service in production mode', async () => {
        propertiesMock.mock.instances[0].config.mode = 'production';
        const translated = tolgee.instant(dummyKey, dummyParams);

        expect(translated).toEqual(translatedDummyText);
        expect(mockedWrap).not.toBeCalled();
        expect(mockedInstant).toBeCalledWith(
          dummyKey,
          dummyParams,
          undefined,
          undefined,
          undefined
        );
      });

      test('will pass noEmpty parameter', () => {
        tolgee.instant(dummyKey, dummyParams, undefined, true);
        expect(mockedInstant).toBeCalledWith(
          dummyKey,
          dummyParams,
          undefined,
          true,
          undefined
        );
      });

      test('will not wrap when development is on, but noWrap is true', async () => {
        propertiesMock.mock.instances[0].config.mode = 'development';
        const translated = tolgee.instant(dummyKey, dummyParams, true);

        expect(mockedWrap).not.toBeCalled();
        expect(translated).toEqual(translatedDummyText);
      });

      test('will call instant with orEmpty true', async () => {
        tolgee.instant(dummyKey, dummyParams, true, true);
        expect(getMockedInstance(TextService).instant).toBeCalledWith(
          dummyKey,
          dummyParams,
          undefined,
          true,
          undefined
        );
      });

      test('passes default value to wrap fn', async () => {
        propertiesMock.mock.instances[0].config.mode = 'development';
        const dummyParams = {};
        tolgee.instant(dummyKey, dummyParams, false, false, 'Default');

        expect(mockedWrap).toBeCalledWith(dummyKey, dummyParams, 'Default');
      });

      test('props object works correctly', async () => {
        propertiesMock.mock.instances[0].config.mode = 'development';
        await tolgee.instant({
          key: dummyKey,
          params: dummyParams,
          orEmpty: false,
          noWrap: true,
          defaultValue: 'Default',
        });
        expect(mockedInstant).toBeCalledWith(
          dummyKey,
          dummyParams,
          undefined,
          false,
          'Default'
        );
      });
    });

    test('passes default value to instant fn', async () => {
      propertiesMock.mock.instances[0].config.mode = 'development';
      const dummyParams = {};
      tolgee.instant(dummyKey, dummyParams, true, false, 'Default');

      expect(mockedInstant).toBeCalledWith(
        dummyKey,
        dummyParams,
        undefined,
        false,
        'Default'
      );
    });
  });

  test('will stop on stop function', () => {
    getMockedInstance(Properties).config.targetElement = document.body;
    NodeHelper.markElementAsTargetElement(document.body);
    tolgee.run();
    tolgee.stop();
    expect(getMockedInstance(ElementRegistrar).cleanAll).toBeCalledTimes(1);
    expect(observerMock.mock.instances[0].stopObserving).toBeCalledTimes(1);
    expect(document.body).not.toHaveAttribute(TOLGEE_TARGET_ATTRIBUTE);
  });

  test('will return proper onLangChange emitter', () => {
    const eventEmitter = new EventEmitterImpl();
    (eventServiceMock.mock.instances[0] as any).LANGUAGE_CHANGED = eventEmitter;
    expect(tolgee.onLangChange).toEqual(eventEmitter);
  });

  test('will return proper initialLoading', () => {
    tolgee.properties.config.mode = 'production';
    tolgee.properties.config.preloadFallback = true;
    tolgee.properties.currentLanguage = 'cs';
    tolgee.properties.config.staticData = {
      cs: {},
    };
    expect(tolgee.initialLoading).toEqual(true);
    tolgee.properties.config.fallbackLanguage = 'en';
    tolgee.properties.config.preloadFallback = false;
    expect(tolgee.initialLoading).toEqual(false);
    tolgee.properties.config.preloadFallback = true;
    tolgee.properties.config.staticData.en = {};
    expect(tolgee.initialLoading).toEqual(false);
    tolgee.properties.config.mode = 'development';
    expect(tolgee.initialLoading).toEqual(true);
  });

  describe('lang setter', () => {
    const dummyLang = 'dummyLang';

    beforeEach(() => {
      (eventServiceMock.mock.instances[0] as any).LANGUAGE_CHANGED =
        new EventEmitterImpl();
      tolgee.lang = dummyLang;
    });

    test('will change the language', () => {
      expect(propertiesMock.mock.instances[0].currentLanguage).toEqual(
        dummyLang
      );
    });

    test('will change the language', () => {
      expect(eventEmitterMock.mock.instances[0].emit).toBeCalledTimes(1);
    });
  });
});
