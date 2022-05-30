import { UiType } from '.';
import { ModifierKey, TreeTranslationsData } from './types';

const API_KEY_SESSION_STORAGE = '__tolgee_apiKey';
const API_URL_SESSION_STORAGE = '__tolgee_apiUrl';

const DEFAULT_TARGET_ELEMENT_SUPPLIER = () => {
  if (typeof document !== 'undefined') {
    return document.body;
  }
};

const DEFAULT_TAG_ATTRIBUTES = {
  textarea: ['placeholder'],
  input: ['value', 'placeholder'],
  img: ['alt'],
  '*': ['aria-label', 'title'],
};

export type TolgeeConfig = {
  apiUrl?: string;
  apiKey?: string;
  inputPrefix?: string;
  inputSuffix?: string;
  language?: string;
  /**
   * Overrides all language settings
   */
  forceLanguage?: string;
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
  watch?: boolean;
  ui?: UiType;
  targetElement?: Element;
  tagAttributes?: { [key: string]: string[] };
  highlightKeys?: ModifierKey[];
  passToParent?: (keyof HTMLElementTagNameMap)[] | ((node: Element) => boolean);
  restrictedElements?: string[];
  highlightColor?: string;
  highlightWidth?: number;
  /** localization data to use in production mode */
  staticData?: {
    [key: string]: TreeTranslationsData | (() => Promise<TreeTranslationsData>);
  };
  wrapperMode?: 'text' | 'invisible';

  /**
   * When true, fallback language will be preloaded on Tolgee.run
   */
  preloadFallback?: boolean;
};

export const initConfig = (config: TolgeeConfig) => {
  let overrideData: Partial<TolgeeConfig> = {};

  if (typeof sessionStorage !== 'undefined') {
    overrideData.apiUrl =
      sessionStorage.getItem(API_URL_SESSION_STORAGE) || undefined;
    overrideData.apiKey =
      sessionStorage.getItem(API_KEY_SESSION_STORAGE) || undefined;
  }

  // remove undefined keys
  overrideData = JSON.parse(JSON.stringify(overrideData));
  return {
    // defaults
    inputPrefix: '%-%tolgee:',
    inputSuffix: '%-%',
    defaultLanguage: 'en',
    enableLanguageStore: true,
    enableLanguageDetection: true,
    filesUrlPrefix: 'i18n/',
    tagAttributes: DEFAULT_TAG_ATTRIBUTES,
    highlightKeys: [ModifierKey.Alt],
    passToParent: ['option', 'optgroup'],
    restrictedElements: ['script', 'style'],
    highlightColor: 'rgb(255, 0, 0)',
    highlightWidth: 5,
    wrapperMode: 'text',
    targetElement: DEFAULT_TARGET_ELEMENT_SUPPLIER(),
    watch: Boolean(config.apiKey && config.apiUrl),
    availableLanguages: Object.keys(config.staticData || {}),
    // user input
    ...config,
    // overrides
    ...overrideData,
  };
};
