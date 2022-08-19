export type Options = {
  language?: string;
  apiUrl?: string;
  apiKey?: string;
  /**
   * Used when auto detection is not available or is turned off
   */
  defaultLanguage?: string;
  /**
   * Languages which can be used for language detection
   * and also limits which values can be stored
   */
  availableLanguages?: string[];
  /**
   * Language which is used when no translation is available for current one
   */
  fallbackLanguage?: string;
  /**
   * Store user language in localStorage (default: true)
   */
  enableLanguageStore?: boolean;
  /**
   * Use auto language detection by browser locale (default: true)
   */
  enableLanguageDetection?: boolean;
  filesUrlPrefix?: string;
  staticData?: {
    [key: string]: TreeTranslationsData | (() => Promise<TreeTranslationsData>);
  };
};

export type TreeTranslationsData = {
  [key: string]: string | TreeTranslationsData;
};

export type TranslationsFlat = Map<string, string>;

export type CacheRecordOrigin = 'initial' | 'prod' | 'dev';

export type CacheRecord = {
  origin: CacheRecordOrigin;
  data: TranslationsFlat;
};

export type CacheTranslations = Map<string, CacheRecord>;
export type CacheAsyncRequests = Map<string, Promise<TreeTranslationsData>>;

export type StateCache = {
  translations: CacheTranslations;
  asyncRequests: CacheAsyncRequests;
};

export type CacheDescriptor = {
  language: string;
  workspace?: string;
};

export type State = {
  language: string;
  pendingLanguage: string;
  initialOptions: Options;
  cache: StateCache;
};

export type CacheKeyObject = {
  language: string;
  workspace: string;
};
