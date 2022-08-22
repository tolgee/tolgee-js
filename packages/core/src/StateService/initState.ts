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
   * Namespaces which should be always (default: true)
   */
  initialNamespaces?: string[];
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
    availableLanguages:
      options.availableLanguages ||
      (options.staticData && Object.keys(options.staticData)),
    fallbackLanguage: options.fallbackLanguage || 'en',
    enableLanguageStore: options.enableLanguageStore || false,
    initialNamespaces: options.initialNamespaces || [''],
    filesUrlPrefix: options.filesUrlPrefix || 'i18n/',
    staticData: options.staticData,
  };
  const language = options.language || initialOptions.defaultLanguage;
  return {
    initialOptions,
    language,
    pendingLanguage: language,
    cache: cacheInit(options.staticData),
  };
};

export type State = ReturnType<typeof initState>;
