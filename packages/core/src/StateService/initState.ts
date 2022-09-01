import {
  FallbackLanguageOption,
  FallbackNS,
  TreeTranslationsData,
} from '../types';

export type Options = {
  /**
   * Initial language (default: 'en')
   */
  language?: string;
  apiUrl?: string;
  apiKey?: string;
  /**
   * Used when auto detection is not available or is turned off
   */
  defaultLanguage: string;
  /**
   * Languages which can be used for language detection
   * and also limits which values can be stored
   */
  availableLanguages?: string[];
  /**
   * Language which is used when no translation is available for current one
   */
  fallbackLanguage?: FallbackLanguageOption;
  /**
   * Store user language in localStorage (default: true)
   */
  enableLanguageStore?: boolean;
  /**
   * Namespaces which should be always fetched
   */
  ns?: string[];
  /**
   * Namespaces to be used to find translation when no explicit namespace set.
   */
  fallbackNs?: FallbackNS;
  /**
   * Default namespace when no namespace defined (default: '')
   */
  defaultNs: string;
  /**
   * Prefix used for fetching languages (default: 'i18n/')
   */
  filesUrlPrefix: string;
  staticData?: {
    [key: string]: TreeTranslationsData | (() => Promise<TreeTranslationsData>);
  };
};

const defaultValues: Options = {
  defaultLanguage: 'en',
  enableLanguageStore: true,
  defaultNs: '',
  filesUrlPrefix: 'i18n/',
};

export const initState = (
  options?: Partial<Options>,
  prevousOptions?: Partial<Options>
) => {
  const initialOptions = {
    ...defaultValues,
    ...prevousOptions,
    ...options,
  };
  const language = initialOptions.language || initialOptions.defaultLanguage;
  return {
    initialOptions,
    activeNamespaces: new Map<string, number>(),
    language,
    pendingLanguage: language,
    isLoading: false,
  };
};

export type State = ReturnType<typeof initState>;
