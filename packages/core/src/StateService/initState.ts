import { TreeTranslationsData } from '../types';
import { cacheInit } from './Cache/Cache';

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
   * Namespaces which should be always fetched (default: true)
   */
  ns?: string[];
  /**
   * Default namespace when no namespace defined (default: '')
   */
  defaultNs?: string;
  filesUrlPrefix?: string;
  staticData?: {
    [key: string]: TreeTranslationsData | (() => Promise<TreeTranslationsData>);
  };
};

export const initState = (options: Options) => {
  const initialOptions = {
    apiKey: options.apiKey,
    apiUrl: options.apiUrl,
    defaultLanguage: options.defaultLanguage || 'en',
    availableLanguages: options.availableLanguages,
    fallbackLanguage: options.fallbackLanguage || 'en',
    enableLanguageStore: options.enableLanguageStore || false,
    defaultNs: options.defaultNs || '',
    ns: options.ns,
    filesUrlPrefix: options.filesUrlPrefix || 'i18n/',
    staticData: options.staticData,
  };
  const language = options.language || initialOptions.defaultLanguage;
  return {
    initialOptions,
    activeNamespaces: new Map<string, number>(),
    language,
    pendingLanguage: language,
    cache: cacheInit(options.staticData),
    isLoading: false,
  };
};

export type State = ReturnType<typeof initState>;
