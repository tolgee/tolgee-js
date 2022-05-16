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

type NamespaceMap<T = any> = {
  [key: string]: T;
};

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
  private fetchPromises: NamespaceMap<Promise<void>> = {};

  // we need to distinguish which languages are in cache initially
  // because we need to refetch them in dev mode
  private fetchedDev: NamespaceMap<boolean> = {};

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
    if (typeof this.properties.config?.staticData === 'object') {
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

  getCachedTranslations() {
    return this.translationsCache;
  }

  private getNamespaceKey(lang: string, ns: string) {
    const nsList = ns ? ns.split('.') : '';
    return [lang, ...nsList].join('.');
  }

  private findByNamespace<T>(
    lang: string,
    ns: string,
    namespaces: NamespaceMap<T>
  ): T | undefined {
    const nsList = ns ? ns.split('.') : [];
    const parts = [lang, ...nsList];
    let key = '';
    for (const part of parts) {
      key = (key ? key + '.' : '') + part;
      if (namespaces[key] !== undefined) {
        return namespaces[key];
      }
    }
    return undefined;
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

  async loadTranslations(
    lang: string = this.properties.currentLanguage,
    ns = ''
  ) {
    if (this.isFetchNeeded(lang, ns)) {
      const promise = this.findByNamespace(lang, ns, this.fetchPromises);
      if (!promise) {
        await this.fetchTranslations(lang, ns);
      } else {
        await promise;
      }
      (this.eventService.LANGUAGE_LOADED as EventEmitterImpl<string>).emit(
        lang
      );
    }
    return this.getNamespaceTranslations(lang, ns);
  }

  private getNamespaceTranslations(lang: string, ns: string) {
    const nsWithDot = ns ? ns + '.' : '';
    const result: Translations = {};
    Object.entries(this.translationsCache.get(lang)).forEach(([key, value]) => {
      if (key.startsWith(nsWithDot)) {
        const trimmedKey = key.substring(nsWithDot.length);
        result[trimmedKey] = value;
      }
    });
    return result;
  }

  async getTranslation(
    key: string,
    lang: string = this.properties.currentLanguage,
    defaultValue?: string,
    ns?: string
  ): Promise<string> {
    if (this.isFetchNeeded(lang)) {
      await this.loadTranslations(lang, ns);
    }
    let message = this.getFromCache(key, lang);

    if (!message) {
      // try to get translation from fallback language
      const fallbackLang = this.properties.config.fallbackLanguage;
      if (this.isFetchNeeded(fallbackLang)) {
        await this.loadTranslations(
          this.properties.config.fallbackLanguage,
          ns
        );
      }
      message = this.getFromCache(key, this.properties.config.fallbackLanguage);
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

  private isFetchNeeded(lang: string, ns?: string) {
    const isDevMode = this.properties.mode === 'development';
    const dataPresent = this.translationsCache.get(lang) !== undefined;
    const devFetched = Boolean(this.findByNamespace(lang, ns, this.fetchedDev));
    return (isDevMode && !devFetched) || !dataPresent;
  }

  private async fetchTranslations(lang: string, ns: string) {
    const isDevMode = this.properties.mode === 'development';
    const namespaceKey = this.getNamespaceKey(lang, ns);
    console.log(lang, ns, isDevMode);

    this.fetchPromises[namespaceKey] = isDevMode
      ? this.fetchTranslationsDevelopment(lang, ns)
      : this.fetchTranslationsProduction(lang, ns);

    return this.fetchPromises[namespaceKey];
  }

  private async fetchTranslationsProduction(
    language: string,
    ns: string | undefined
  ) {
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

  private async fetchTranslationsDevelopment(
    language: string,
    ns: string | undefined
  ) {
    await this.coreService.loadApiKeyDetails();
    this.coreService.checkScope('translations.view');
    try {
      const data = await this.apiHttpService.fetchJson(
        `v2/projects/translations/${language}`
      );
      const namespaceKey = this.getNamespaceKey(language, ns);
      this.fetchedDev[namespaceKey] = true;
      this.setLanguageData(language, data[language]);
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

    const oldData = this.translationsCache.get(language);
    const newData = makeFlat(data);
    const result = { ...oldData, ...newData };

    this.translationsCache.set(language, result);
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
