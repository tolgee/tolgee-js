import {
  FallbackGeneral,
  FallbackLanguageOption,
  TreeTranslationsData,
  OnFormatError,
  FetchFn,
  MissingTranslationHandler,
  CachePublicRecord,
} from '../../types';
import { createFetchFunction, sanitizeUrl } from '../../helpers';
import {
  defaultObserverOptions,
  ObserverOptions,
  ObserverOptionsInternal,
} from './observerOptions';

export const DEFAULT_FORMAT_ERROR = 'invalid';
export const DEFAULT_API_URL = 'https://app.tolgee.io';
export const DEFAULT_MISSING_TRANSLATION: MissingTranslationHandler = ({
  key,
}) => key;

export type TolgeeStaticData = {
  [key: string]: TreeTranslationsData | (() => Promise<TreeTranslationsData>);
};

export type TolgeeStaticDataProp = TolgeeStaticData | CachePublicRecord[];

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
   * Specify all available languages. Required for language detection or loading all languages at once (loadMatrix).
   * It also limits which values can be stored. Is derrived from `staticData` keys if not provided.
   */
  availableLanguages?: string[];

  /**
   * Language which is used when no translation is available for current one
   */
  fallbackLanguage?: FallbackLanguageOption;

  /**
   * Namespaces which should be always fetched (default: [defaultNs] or [''])
   */
  ns?: string[];

  /**
   * Namespaces to be used to find translation when no explicit namespace set.
   */
  fallbackNs?: FallbackGeneral;

  /**
   * Default namespace when no namespace defined (default: first from `ns`)
   */
  defaultNs?: string;

  /**
   * Specify all available namespaces. Required for loading all namespaces at once (loadMatrix).
   */
  availableNs?: string[];

  /**
   * These data go directly to cache or you can specify async
   * function which will be used to get the data. Use `:` to add namespace:
   *
   * ```ts
   * {
   *   'language': <translations | async function>
   *   'language:namespace': <translations | async function>
   * }
   * ```
   *
   * You can also pass list of `CachePublicRecord`, which is in format:
   *
   * {
   *   'language': <locale>,
   *   'namespace': <namespace>
   *   'data': <translations>
   * }
   *
   */
  staticData?: TolgeeStaticDataProp;

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

  /**
   * Define what to do when translation is missing.
   * Is called when translation missing.
   * If no orEmpty or defaultValue are defined, return value is rendered. (function is called regardless)
   */
  onTranslationMissing: MissingTranslationHandler;

  /**
   * Define custom fetch function, used for fetching the translations
   */
  fetch: FetchFn;

  /**
   * Specify tags that will be preselected for non-existant keys.
   */
  tagNewKeys?: string[];

  /**
   * Use only keys tagged with one of the listed tags
   */
  filterTag?: string[];

  /**
   * automatically load required records on `run` and `changeLanguage` (default: true)
   */
  autoLoadRequiredData: boolean;
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
  observerOptions: defaultObserverOptions,
  observerType: 'invisible',
  onFormatError: DEFAULT_FORMAT_ERROR,
  apiUrl: DEFAULT_API_URL,
  autoLoadRequiredData: true,
  fetch: createFetchFunction(),
  onTranslationMissing: DEFAULT_MISSING_TRANSLATION,
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

export function initState(
  options?: Partial<TolgeeOptions>,
  previousState?: State
): State {
  const initialOptions = combineOptions(
    defaultValues,
    previousState?.initialOptions,
    options
  ) as TolgeeOptionsInternal;

  // remove extra '/' from url end
  initialOptions.apiUrl = sanitizeUrl(initialOptions.apiUrl);

  if (options?.fetch) {
    initialOptions.fetch = createFetchFunction(options.fetch);
  }

  return {
    initialOptions,
    activeNamespaces:
      previousState?.activeNamespaces || new Map<string, number>(),
    language: previousState?.language,
    pendingLanguage: previousState?.language,
    isInitialLoading: false,
    isRunning: false,
  };
}
