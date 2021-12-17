import { Translations, TreeTranslationsData } from '../types';
import { Properties } from '../Properties';
import { CoreService } from './CoreService';
import { ApiHttpService } from './ApiHttpService';
import { ApiHttpError } from '../Errors/ApiHttpError';
import { EventService } from './EventService';
import { EventEmitterImpl } from './EventEmitter';
import {
  ComplexEditKeyDto,
  CreateKeyDto,
  KeyWithDataModel,
  KeyWithTranslationsModel,
  SetTranslationsResponseModel,
  SetTranslationsWithKeyDto,
  TranslationData,
} from '../types/DTOs';

interface TranslationInterface {
  text?: string;
}

interface Key {
  id?: number;
  name: string;
  translations: Record<string, TranslationInterface>;
}

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

  private static translationByValue(message: string, defaultValue?: string) {
    if (message) {
      return message;
    }

    if (defaultValue) {
      return defaultValue;
    }

    return undefined;
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
            this.setLanguageData(language, data);
          }
        }
      );
    }
  }

  getChachedTranslations() {
    return this.translationsCache;
  }

  updateTranslationInCache = async (data: Key) => {
    const result: Record<string, string> = {};
    Object.entries(data.translations).forEach(([lang, translation]) => {
      const cachedData = this.translationsCache.get(lang);
      if (cachedData) {
        cachedData[data.name] = translation.text;
      }
      result[lang] = translation.text;
    });
    await (
      this.eventService.TRANSLATION_CHANGED as EventEmitterImpl<TranslationData>
    ).emit(new TranslationData(data.name, result, data.id));
  };

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
    defaultValue?: string
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

    return TranslationService.translationByValue(message, defaultValue);
  }

  async updateKeyComplex(
    id: number,
    data: ComplexEditKeyDto
  ): Promise<KeyWithDataModel> {
    this.coreService.checkScope('translations.edit');
    const result = (await this.apiHttpService.postJson(
      `v2/projects/keys/${id}/complex-update`,
      {
        ...data,
        screenshotUploadedImageIds: data.screenshotUploadedImageIds?.length
          ? data.screenshotUploadedImageIds
          : undefined,
        screenshotIdsToDelete: data.screenshotIdsToDelete?.length
          ? data.screenshotIdsToDelete
          : undefined,
      },
      { method: 'put' }
    )) as KeyWithDataModel;

    await this.updateTranslationInCache(result);

    return result;
  }

  async createKey(data: CreateKeyDto): Promise<KeyWithDataModel> {
    this.coreService.checkScope('keys.edit');
    const result = (await this.apiHttpService.postJson(
      `v2/projects/keys/create`,
      {
        ...data,
        screenshotUploadedImageIds: data.screenshotUploadedImageIds?.length
          ? data.screenshotUploadedImageIds
          : undefined,
      }
    )) as KeyWithDataModel;

    await this.updateTranslationInCache(result);

    return result;
  }

  async setTranslations(
    translationData: SetTranslationsWithKeyDto
  ): Promise<SetTranslationsResponseModel> {
    this.coreService.checkScope('translations.edit');
    const result = (await this.apiHttpService.postJson(
      'v2/projects/translations',
      translationData
    )) as SetTranslationsResponseModel;

    await this.updateTranslationInCache({
      id: result.keyId,
      name: result.keyName,
      translations: result.translations,
    });

    return result;
  }

  /**
   * Change translations of some keys to some value temporarily.
   * For screenshot taking with provided values, before actually saving
   * the values
   *
   * @return Returns callback changing affected translations back
   */
  async changeTranslations({
    key,
    translations,
  }: TranslationData): Promise<() => void> {
    const old: Record<string, string> = {};

    Object.entries(translations).forEach(([language, value]) => {
      const data = this.translationsCache.get(language);
      if (data) {
        old[language] = data[key];
        data[key] = value;
      }
    });

    await (
      this.eventService.TRANSLATION_CHANGED as EventEmitterImpl<TranslationData>
    ).emit({
      key,
      translations,
    });

    // callback to revert the operation
    return async () => {
      Object.entries(old).forEach(([language, value]) => {
        const data = this.translationsCache.get(language);
        if (data) {
          data[key] = value;
        }
      });
      await (
        this.eventService
          .TRANSLATION_CHANGED as EventEmitterImpl<TranslationData>
      ).emit({
        key,
        translations: old,
      });
    };
  }

  getFromCacheOrFallback(
    key: string,
    lang: string = this.properties.currentLanguage,
    defaultValue?: string
  ): string {
    const message =
      this.getFromCache(key, lang) ||
      this.getFromCache(key, this.properties.config.fallbackLanguage);
    return TranslationService.translationByValue(message, defaultValue);
  }

  getTranslationsOfKey = async (
    key: string,
    languages: Set<string> = new Set([this.properties.currentLanguage])
  ) => {
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

      const firstItem = data._embedded?.keys?.[0] as
        | KeyWithTranslationsModel
        | undefined;

      if (firstItem?.translations) {
        Object.entries(firstItem.translations).forEach(
          ([language, translation]) =>
            (translationData[language] = (translation as any).text)
        );
      }

      const langs = data.selectedLanguages?.map((l) => l.tag) as string[];

      return [firstItem, langs] as const;
    } catch (e) {
      if (
        e instanceof ApiHttpError &&
        e.response.status === 404 &&
        e.code === 'language_not_found'
      ) {
        // only possible reason for this error is, that languages definition
        // is changed, but the old value is stored in preferred languages
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
      this.setLanguageData(language, data);
      return;
    } else if (langStaticData !== undefined) {
      this.setLanguageData(language, langStaticData);
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
        this.setLanguageData(language, {});
        return;
      }
      try {
        const data = await result.json();
        this.setLanguageData(language, data);
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
    await this.coreService.loadApiKeyDetails();
    this.coreService.checkScope('translations.view');
    try {
      const data = await this.apiHttpService.fetchJson(
        `v2/projects/translations/${language}`
      );
      this.setLanguageData(language, data[language] || {});
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

  private setLanguageData(language: string, data: TreeTranslationsData) {
    // recursively walk the tree and make it flat, when tree data are provided
    const makeFlat = (data: TreeTranslationsData): Record<string, string> => {
      const result: Record<string, string> = {};
      Object.entries(data).forEach(([key, value]) => {
        // ignore falsy values
        if (!value) {
          return;
        }
        if (typeof value === 'object') {
          Object.entries(makeFlat(value)).forEach(([flatKey, flatValue]) => {
            result[key + '.' + flatKey] = flatValue;
          });
          return;
        }
        result[key] = value as string;
      });
      return result;
    };

    this.translationsCache.set(language, makeFlat(data));
  }

  private getFromCache(
    key: string,
    lang: string = this.properties.currentLanguage
  ): string {
    const root: string | Translations = this.translationsCache.get(lang);

    //if lang is not downloaded or does not exist at all
    if (root === undefined) {
      return undefined;
    }

    return root[key] as string;
  }
}
