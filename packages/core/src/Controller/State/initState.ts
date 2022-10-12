import {
  FallbackLanguageOption,
  FallbackNS,
  TreeTranslationsData,
} from '../../types';

export type TolgeeOptions = {
  /**
   * Initial language
   */
  language?: string;
  apiUrl?: string;
  apiKey?: string;
  projectId?: number;
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
  fallbackLanguage?: FallbackLanguageOption;
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
  staticData?: {
    [key: string]: TreeTranslationsData | (() => Promise<TreeTranslationsData>);
  };
};

export type State = {
  initialOptions: TolgeeOptions;
  activeNamespaces: Map<string, number>;
  language: string | undefined;
  pendingLanguage: string | undefined;
  isInitialLoading: boolean;
  isRunning: boolean;
};

const defaultValues: TolgeeOptions = {
  defaultNs: '',
};

export const initState = (
  options?: Partial<TolgeeOptions>,
  previousState?: State
): State => {
  const initialOptions = {
    ...defaultValues,
    ...previousState?.initialOptions,
    ...options,
  };

  // remove extra '/' from url end
  const apiUrl = initialOptions.apiUrl;
  initialOptions.apiUrl = apiUrl ? apiUrl.replace(/\/+$/, '') : apiUrl;

  return {
    initialOptions,
    activeNamespaces:
      previousState?.activeNamespaces || new Map<string, number>(),
    language: previousState?.language,
    pendingLanguage: previousState?.language,
    isInitialLoading: false,
    isRunning: false,
  };
};
