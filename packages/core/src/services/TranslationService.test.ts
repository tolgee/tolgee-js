jest.dontMock('./TranslationService');
jest.dontMock('../helpers/TextHelper');
jest.dontMock('../DTOs/TranslationData');
jest.dontMock('../Errors/ApiHttpError');
jest.dontMock('./DependencyStore');

import { TranslationService } from './TranslationService';
import { getMockedInstance } from '@testFixtures/mocked';
import { ApiHttpService } from './ApiHttpService';
import { Properties } from '../Properties';
import { CoreService } from './CoreService';
import { TranslationData } from '../DTOs/TranslationData';
import { ApiHttpError } from '../Errors/ApiHttpError';
import { EventService } from './EventService';
import { DependencyStore } from './DependencyStore';

const mockedTranslations = {
  en: {
    key: 'translated',
    'translation.with.dots': 'Translation with dots',
    structured: {
      subtree: {
        translation: 'Structured subtree translation',
      },
    },
    'key with: \\\\': {
      t: 'Key with strange escapes',
    },
    just_en: 'Just en.',
  },
  de: {
    key: 'übersetzen',
    just_en: '',
  },
};

global.fetch = jest.fn(async (url: string) => {
  const isEn = url.indexOf('en.json') > -1;
  const isDe = url.indexOf('de.json') > -1;

  return {
    json: jest.fn(async () =>
      isEn ? mockedTranslations.en : isDe ? mockedTranslations.de : {}
    ),
  };
}) as any;

describe('TranslationService', () => {
  let translationService: TranslationService;
  const languageLoadedEmitMock = jest.fn();
  const translationChangedEmitMock = jest.fn();

  beforeEach(async () => {
    translationService = new DependencyStore().translationService;
    (getMockedInstance(EventService) as any).LANGUAGE_LOADED = {
      emit: languageLoadedEmitMock,
    };
    (getMockedInstance(EventService) as any).TRANSLATION_CHANGED = {
      emit: translationChangedEmitMock,
    };
    getMockedInstance(ApiHttpService).fetchJson = jest.fn(
      async () => mockedTranslations
    );
    getMockedInstance(Properties).currentLanguage = 'en';
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  describe('(translation loading and retrieval)', () => {
    test('will load translations in production mode', async () => {
      await translationService.loadTranslations('en');
      expect(translationService.getFromCacheOrFallback('key', 'en')).toEqual(
        'translated'
      );
    });

    test('will load translations in development mode', async () => {
      getMockedInstance(Properties).config.mode = 'development';
      await translationService.loadTranslations('en');
      expect(translationService.getFromCacheOrFallback('key', 'en')).toEqual(
        'translated'
      );
    });

    test('will try to load the languages only single time', async () => {
      await translationService.loadTranslations('en');
      await translationService.loadTranslations('en');
      expect(fetch).toBeCalledTimes(1);
    });

    test('will get proper translation', async () => {
      expect(await translationService.getTranslation('key', 'en')).toEqual(
        'translated'
      );
    });

    test('will get proper translation containing .', async () => {
      expect(
        await translationService.getTranslation('translation.with.dots')
      ).toEqual('Translation with dots');
    });

    test('will get proper structured subtree translation', async () => {
      expect(
        await translationService.getTranslation(
          'structured.subtree.translation'
        )
      ).toEqual('Structured subtree translation');
    });

    test('will get proper translation on strange key', async () => {
      expect(
        await translationService.getTranslation('key with: \\\\.t')
      ).toEqual('Key with strange escapes');
    });

    test('will return fallback lang translation', async () => {
      expect(await translationService.getTranslation('key', 'cz')).toEqual(
        'translated'
      );
    });

    test('will get translations of key', async () => {
      getMockedInstance(ApiHttpService).fetchJson = jest.fn(async () => ({
        _embedded: {
          keys: [
            {
              translations: {
                en: { text: 'translated' },
                de: { text: 'übersetzen' },
              },
            },
          ],
        },
      }));
      const translationData = await translationService.getTranslationsOfKey(
        'key',
        new Set<string>(['en', 'de'])
      );
      expect(translationData).toEqual({
        key: 'key',
        translations: { en: 'translated', de: 'übersetzen' },
      });
    });

    test('will reset preferred languages when language is not found', async () => {
      global['apierror'] = ApiHttpError;
      getMockedInstance(ApiHttpService).fetchJson = jest.fn(async () => {
        throw new ApiHttpError(
          { status: 404 } as Response,
          'language_not_found'
        );
      });

      delete global.location;
      global.location = { reload: jest.fn() } as any;
      global.console.error = jest.fn();
      getMockedInstance(CoreService).getLanguages = jest.fn(
        async () => new Set(['dummyLang'])
      );
      await translationService.getTranslationsOfKey('aaa', new Set<string>());
      expect(getMockedInstance(Properties).preferredLanguages).toEqual(
        new Set(['dummyLang'])
      );
      // eslint-disable-next-line no-console
      expect(console.error).toBeCalledTimes(1);
      expect(location.reload).toBeCalledTimes(1);
    });

    test('will emit on translations load', async () => {
      await translationService.loadTranslations('en');
      await translationService.loadTranslations('de');
      await translationService.loadTranslations('en');

      expect(languageLoadedEmitMock).toBeCalledTimes(2);
      expect(languageLoadedEmitMock).toHaveBeenNthCalledWith(1, 'en');
      expect(languageLoadedEmitMock).toHaveBeenNthCalledWith(2, 'de');
    });
  });

  describe('set translation', () => {
    const dummyTranslationData = {
      key: 'test key',
      translations: { en: 'translation' },
    } as TranslationData;

    beforeEach(async () => {
      await translationService.setTranslations(dummyTranslationData);
    });

    test('will call the api http service', async () => {
      expect(getMockedInstance(ApiHttpService).postJson).toBeCalledTimes(1);
      expect(getMockedInstance(ApiHttpService).postJson).toBeCalledWith(
        'v2/projects/translations',
        dummyTranslationData
      );
    });

    test('will check the scopes', async () => {
      expect(getMockedInstance(CoreService).checkScope).toBeCalledTimes(1);
    });

    test('emits translation changed event', async () => {
      expect(translationChangedEmitMock).toBeCalledTimes(1);
      expect(translationChangedEmitMock).toBeCalledWith(dummyTranslationData);
    });

    test('will update the data', async () => {
      await translationService.loadTranslations('en');
      await translationService.setTranslations(dummyTranslationData);
      expect(
        await translationService.getTranslation(dummyTranslationData.key, 'en')
      ).toEqual(dummyTranslationData.translations.en);
    });
  });

  test('will update the data when the key contains .', async () => {
    const dummyTranslationData = {
      key: 'test.key',
      translations: { en: 'translation' },
    } as TranslationData;
    await translationService.loadTranslations('en');
    await translationService.setTranslations(dummyTranslationData);
    expect(
      await translationService.getTranslation(dummyTranslationData.key, 'en')
    ).toEqual(dummyTranslationData.translations.en);
  });

  test('will update the data when the key contains \\.', async () => {
    const dummyTranslationData = {
      key: 'test\\.key',
      translations: { en: 'translation' },
    } as TranslationData;
    await translationService.loadTranslations('en');
    await translationService.setTranslations(dummyTranslationData);
    expect(
      await translationService.getTranslation(dummyTranslationData.key, 'en')
    ).toEqual(dummyTranslationData.translations.en);
  });

  test('will call load of fallback language on missing translation', async () => {
    translationService.loadTranslations = jest.fn();
    getMockedInstance(Properties).config.fallbackLanguage = 'en';
    expect(await translationService.getTranslation('aaa', 'cs'));
    expect(translationService.loadTranslations).toBeCalledTimes(2);
    expect(translationService.loadTranslations).toBeCalledWith('cs');
    expect(translationService.loadTranslations).toBeCalledWith('en');
  });

  test('will use fallback language on missing translation', async () => {
    getMockedInstance(Properties).config.fallbackLanguage = 'en';
    expect(
      await translationService.getTranslation('translation.with.dots', 'de')
    ).toEqual('Translation with dots');
  });

  test('getTranslation will return fallback when message is empty string', async () => {
    getMockedInstance(Properties).config.fallbackLanguage = 'en';
    expect(await translationService.getTranslation('just_en', 'de')).toEqual(
      'Just en.'
    );
  });

  test('getFromCacheOrCallback will return fallback when message is empty string', async () => {
    getMockedInstance(Properties).config.fallbackLanguage = 'en';
    (translationService as any).setLanguageData('en', mockedTranslations.en);
    (translationService as any).setLanguageData('de', mockedTranslations.de);
    expect(
      await translationService.getFromCacheOrFallback('just_en', 'de')
    ).toEqual('Just en.');
  });

  test('getFromCacheOrCallback will return default when provided', async () => {
    expect(
      await translationService.getFromCacheOrFallback(
        'this_key_is_not_in_cache',
        'de',
        false,
        'Default'
      )
    ).toEqual('Default');
  });

  test('getFromCacheOrCallback will return empty when onEmpty is true', async () => {
    expect(
      await translationService.getFromCacheOrFallback(
        'this_key_is_not_in_cache',
        'de',
        true
      )
    ).toEqual('');
  });

  test('will return key when no translation found', async () => {
    expect(
      await translationService.getTranslation('test\\.key.this\\.is\\.it', 'en')
    ).toEqual('test\\.key.this\\.is\\.it');
  });

  test('returns default when provided', async () => {
    expect(
      await translationService.getTranslation(
        'youaaaahihahihh',
        'en',
        undefined,
        'This is default'
      )
    ).toEqual('This is default');
  });

  test('will return proper text without any dot', async () => {
    expect(
      await translationService.getTranslation('text without any dot', 'en')
    ).toEqual('text without any dot');
  });

  test('uses provided static data', async () => {
    getMockedInstance(Properties).config.staticData = {
      en: { test: 'Test test' },
    };
    translationService.initStatic();
    expect(await translationService.getTranslation('test', 'en')).toEqual(
      'Test test'
    );
  });

  test('uses provided promise data', async () => {
    getMockedInstance(Properties).config.staticData = {
      en: () => new Promise((resolve) => resolve({ test: 'Test test' })),
    };
    expect(await translationService.getTranslation('test', 'en')).toEqual(
      'Test test'
    );
  });

  test('uses provided data without init static (when mode is changed dynamically)', async () => {
    getMockedInstance(Properties).config.staticData = {
      en: { test: 'Test test' },
    };
    expect(await translationService.getTranslation('test', 'en')).toEqual(
      'Test test'
    );
  });
});
