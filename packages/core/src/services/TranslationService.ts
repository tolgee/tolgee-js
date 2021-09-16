import { Translations } from '../types';
import { TranslationData } from '../DTOs/TranslationData';
import { Properties } from '../Properties';
import { CoreService } from './CoreService';
import { ApiHttpService } from './ApiHttpService';
import { TextHelper } from '../helpers/TextHelper';
import { ApiHttpError } from '../Errors/ApiHttpError';
import { EventService } from './EventService';
import { EventEmitterImpl } from './EventEmitter';

export class TranslationService {
  private translationsCache: Map<string, Translations> = new Map<
    string,
    Translations
  >();
  private fetchPromises: { [key: string]: Promise<any> } = {};

  constructor(
    private properties: Properties,
    private coreService: CoreService,
    private apiHttpService: ApiHttpService,
    private eventService: EventService
  ) {}

  private static translationByValue(
    message: string,
    key: string,
    orEmpty: boolean
  ) {
    if (message) {
      return message;
    }

    if (orEmpty) {
      return '';
    }

    const path = TextHelper.splitOnNonEscapedDelimiter(key, '.');
    return path[path.length - 1];
  }

  initStatic() {
    if (
      this.properties.config.mode === 'production' &&
      typeof this.properties.config?.staticData === 'object'
    ) {
      Object.entries(this.properties.config.staticData).forEach(
        ([language, data]) => {
          //if not provider or promise then it is raw data
          if (typeof data !== 'function') {
            this.translationsCache.set(language, data);
          }
        }
      );
    }
  }

  async loadTranslations(lang: string = this.properties.currentLanguage) {
    if (this.translationsCache.get(lang) == undefined) {
      if (!(this.fetchPromises[lang] instanceof Promise)) {
        this.fetchPromises[lang] = this.fetchTranslations(lang);
      }
      await this.fetchPromises[lang];
      (this.eventService.LANGUAGE_LOADED as EventEmitterImpl<string>).emit(
        lang
      );
    }
    this.fetchPromises[lang] = undefined;
  }

  async getTranslation(
    key: string,
    lang: string = this.properties.currentLanguage,
    orEmpty = false
  ): Promise<string> {
    let message = this.getFromCache(key, lang);

    if (!message) {
      await this.loadTranslations(lang);
      message = this.getFromCache(key, lang);
      if (!message) {
        message = this.getFromCache(
          key,
          this.properties.config.fallbackLanguage
        );
        if (!message) {
          await this.loadTranslations(this.properties.config.fallbackLanguage);
          message = this.getFromCache(
            key,
            this.properties.config.fallbackLanguage
          );
        }
      }
    }

    return TranslationService.translationByValue(message, key, orEmpty);
  }

  async setTranslations(translationData: TranslationData) {
    this.coreService.checkScope('translations.edit');

    const result = await this.apiHttpService.postJson(
      'v2/projects/translations',
      {
        key: translationData.key,
        translations: translationData.translations,
      }
    );

    Object.keys(translationData.translations).forEach((lang) => {
      if (this.translationsCache.get(lang)) {
        // if the language is not loaded, then ignore the change
        const path = TextHelper.splitOnNonEscapedDelimiter(
          translationData.key,
          '.'
        );
        let root: string | Translations = this.translationsCache.get(lang);
        for (let i = 0; i < path.length; i++) {
          const item = path[i];
          if (root[item] === undefined) {
            root[item] = {};
          }
          if (i === path.length - 1) {
            root[item] = translationData.translations[lang];
            return;
          }
          root = root[item];
        }
      }
    });
    return result;
  }

  async uploadScreenshot(key, data) {
    this.coreService.checkScope('translations.edit');

    const formData = new FormData();

    const blob = await fetch(data).then((r) => r.blob());
    formData.append('screenshot', blob);

    return this.apiHttpService.post(
      `v2/projects/keys/${key}/screenshots`,
      undefined,
      { headers: {}, body: formData }
    );
  }

  getFromCacheOrFallback(
    key: string,
    lang: string = this.properties.currentLanguage,
    orEmpty = false
  ): string {
    const message =
      this.getFromCache(key, lang) ||
      this.getFromCache(key, this.properties.config.fallbackLanguage);
    return TranslationService.translationByValue(message, key, orEmpty);
  }

  getTranslationsOfKey = async (
    key: string,
    languages: Set<string> = new Set([this.properties.currentLanguage])
  ): Promise<TranslationData> => {
    this.coreService.checkScope('translations.view');
    try {
      const languagesArray = [...languages];
      const languagesQuery = languagesArray
        .map((l) => `languages=${l}`)
        .join('&');
      const data = await this.apiHttpService.fetchJson(
        `v2/projects/translations?${languagesQuery}&filterKeyName=${encodeURIComponent(
          key
        )}`
      );

      const translationData = languagesArray.reduce(
        (acc, curr) => ({ ...acc, [curr]: '' }),
        {}
      );

      const firstItem = data._embedded?.keys?.[0];

      const fetchedData = firstItem?.translations;

      if (fetchedData) {
        Object.entries(data._embedded?.keys?.[0]?.translations).forEach(
          ([language, translation]) =>
            (translationData[language] = (translation as any).text)
        );
      }

      return new TranslationData(key, translationData, firstItem?.keyId);
    } catch (e) {
      if (
        e instanceof ApiHttpError &&
        e.response.status === 404 &&
        e.code === 'language_not_found'
      ) {
        //only possible reason for this error is, that languages definition is changed, but the old value is stored in preferred languages
        this.properties.preferredLanguages =
          await this.coreService.getLanguages();
        // eslint-disable-next-line no-console
        console.error('Requested language not found, refreshing the page!');
        location.reload();
      } else {
        throw e;
      }
    }
  };

  private async fetchTranslations(lang: string) {
    if (this.properties.config.mode === 'development') {
      return await this.fetchTranslationsDevelopment(lang);
    }
    return await this.fetchTranslationsProduction(lang);
  }

  private async fetchTranslationsProduction(language: string) {
    const langStaticData = this.properties.config?.staticData?.[language];

    if (typeof langStaticData === 'function') {
      const data = await langStaticData();
      this.translationsCache.set(language, data);
      return;
    } else if (langStaticData !== undefined) {
      this.translationsCache.set(language, langStaticData);
      return;
    }

    const url = `${
      this.properties.config.filesUrlPrefix || '/'
    }${language}.json`;
    try {
      const result = await fetch(url);
      if (result.status >= 400) {
        //on error set language data as empty object to not break the flow
        // eslint-disable-next-line no-console
        console.error(
          'Server responded with error status while loading localization data.'
        );
        this.translationsCache.set(language, {});
        return;
      }
      try {
        const data = await result.json();
        this.translationsCache.set(language, data);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(`Error parsing json retrieved from ${url}.`);
        this.setEmptyLanguageData(language);
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(`Error fetching localization data from ${url}.`);
      this.setEmptyLanguageData(language);
    }
  }

  private async fetchTranslationsDevelopment(language: string) {
    this.coreService.checkScope('translations.view');
    try {
      const data = await this.apiHttpService.fetchJson(
        `v2/projects/translations/${language}`
      );
      this.translationsCache.set(language, data[language] || {});
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Error while fetching localization data from API.', e);
      this.setEmptyLanguageData(language);
      return;
    }
  }

  private setEmptyLanguageData(language: string) {
    this.translationsCache.set(language, {});
  }

  private getFromCache(
    key: string,
    lang: string = this.properties.currentLanguage
  ): string {
    const path = TextHelper.splitOnNonEscapedDelimiter(key, '.');
    let root: string | Translations = this.translationsCache.get(lang);

    //if lang is not downloaded or does not exist at all
    if (root === undefined) {
      return undefined;
    }

    //if data contains key directly, just return it
    if (typeof root[key] === 'string') {
      return root[key] as string;
    }

    for (const item of path) {
      if (root[item] === undefined) {
        return undefined;
      }
      root = root[item];
    }
    return root as string;
  }
}
