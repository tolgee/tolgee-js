import {
  FallbackGeneral,
  FallbackLanguageOption,
  TreeTranslationsData,
  OnFormatError,
} from '../../types';
import { sanitizeUrl } from '../../helpers';
import {
  defaultObserverOptions,
  ObserverOptions,
  ObserverOptionsInternal,
} from './observerOptions';

export const DEFAULT_FORMAT_ERROR = 'invalid';
export const DEFAULT_API_URL = 'https://app.tolgee.io';

export type TolgeeStaticData = {
  [key: string]: TreeTranslationsData | (() => Promise<TreeTranslationsData>);
};

export type TolgeeOptionsInternal = {
  /**
   * Initial language
   */
  language?: string;

  /**
   * Tolgee instance url (default: https://app.tolgee.io)
   */
  apiUrl?: string;

  /**
   * Project API key (PAK) or Personal Access Token (PAT)
   */
  apiKey?: string;

  /**
   * Project id is necessary if you are using PAT
   */
  projectId?: number | string;

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
  fallbackNs?: FallbackGeneral;

  /**
   * Default namespace when no namespace defined (default: '')
   */
  defaultNs: string;

  /**
   * These data go directly to cache or you can specify async
   * function which will be used to get the data. Use `:` to add namespace:
   *
   * ```ts
   * {
   *   'locale': <translations | async function>
   *   'locale:namespace': <translations | async function>
   * }
   * ```
   */
  staticData?: TolgeeStaticData;

  /**
   * Switches between invisible and text observer. (Default: invisible)
   */
  observerType: 'invisible' | 'text';

  /**
   * Observer options object.
   */
  observerOptions: ObserverOptionsInternal;

  /**
   * Define what to display in case of formatting error. (Default: 'invalid')
   */
  onFormatError: OnFormatError;
};

export type TolgeeOptions = Partial<
  Omit<TolgeeOptionsInternal, 'observerOptions'>
> & {
  observerOptions?: ObserverOptions;
};

export type State = {
  initialOptions: TolgeeOptionsInternal;
  activeNamespaces: Map<string, number>;
  language: string | undefined;
  pendingLanguage: string | undefined;
  isInitialLoading: boolean;
  isRunning: boolean;
};

const defaultValues: TolgeeOptionsInternal = {
  defaultNs: '',
  observerOptions: defaultObserverOptions,
  observerType: 'invisible',
  onFormatError: DEFAULT_FORMAT_ERROR,
  apiUrl: DEFAULT_API_URL,
};

export const combineOptions = <T extends TolgeeOptions>(
  ...states: (T | undefined)[]
) => {
  let result = {} as T;
  states.forEach((state) => {
    result = {
      ...result,
      ...state,
      observerOptions: {
        ...result.observerOptions,
        ...state?.observerOptions,
      },
    };
  });
  return result;
};

export const initState = (
  options?: Partial<TolgeeOptions>,
  previousState?: State
): State => {
  const initialOptions = combineOptions(
    defaultValues,
    previousState?.initialOptions,
    options
  ) as TolgeeOptionsInternal;

  // remove extra '/' from url end
  initialOptions.apiUrl = sanitizeUrl(initialOptions.apiUrl);

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
