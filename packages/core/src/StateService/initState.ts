import { TreeTranslationsData } from '../types';

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

const defaultValues = {
  defaultLanguage: 'en',
  language: 'en',
  enableLanguageStore: false,
  defaultNs: '',
  filesUrlPrefix: 'i18n/',
} as const;

export const initState = (options: Options, prevousOptions?: Options) => {
  const initialOptions = {
    ...defaultValues,
    ...prevousOptions,
    ...options,
  };
  const language = options.language || initialOptions.defaultLanguage;
  return {
    initialOptions,
    activeNamespaces: new Map<string, number>(),
    language,
    pendingLanguage: language,
    isLoading: false,
  };
};

export type State = ReturnType<typeof initState>;
