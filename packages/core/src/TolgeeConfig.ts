import { TreeTranslationsData } from './types';
import { NodeHelper } from './helpers/NodeHelper';
import { ModifierKey } from './Constants/ModifierKey';
import { Mode } from 'fs';

const API_KEY_LOCAL_STORAGE = '__tolgee_apiKey';
const API_URL_LOCAL_STORAGE = '__tolgee_apiUrl';

const DEFAULT_TARGET_ELEMENT_SUPPLIER = () => {
  if (typeof document !== 'undefined') {
    return document.body;
  }
};

type UiConstructor = new (...args) => any;

interface UiLibInterface {
  UI: UiConstructor;
}

type UiType =
  | UiConstructor
  | UiLibInterface
  | Promise<UiConstructor>
  | Promise<UiLibInterface>;

export class TolgeeConfig {
  /**
   * @deprecated This option won't have any effect,
   * because mode is now automatically detected when apiKey + apiUrl are set
   */
  mode?: Mode;
  apiUrl?: string;
  apiKey?: string;
  inputPrefix?: string = '%-%tolgee:';
  inputSuffix?: string = '%-%';
  /**
   * Overrides all language settings
   */
  forceLanguage?: string;
  /**
   * Used when auto detection is not available or is turned off
   */
  defaultLanguage?: string = 'en';
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
  enableLanguageStore?: boolean = true;
  /**
   * Use auto language detection by browser locale (default: true)
   */
  enableLanguageDetection?: boolean = true;
  filesUrlPrefix?: string = 'i18n/';
  watch?: boolean;
  ui?: UiType;
  targetElement?: Element;
  tagAttributes?: { [key: string]: string[] } = {
    textarea: ['placeholder'],
    input: ['value', 'placeholder'],
    img: ['alt'],
    '*': ['aria-label', 'title'],
  };
  highlightKeys?: ModifierKey[] = [ModifierKey.Alt];
  passToParent?:
    | (keyof HTMLElementTagNameMap)[]
    | ((node: Element) => boolean) = ['option', 'optgroup'];
  restrictedElements?: string[] = ['script', 'style'];
  highlightColor?: string = 'rgb(255, 0, 0)';
  highlightWidth?: number = 5;
  /** localization data to use in production mode */
  staticData?: {
    [key: string]: TreeTranslationsData | (() => Promise<TreeTranslationsData>);
  };
  wrapperMode?: 'text' | 'invisible' = 'text';

  /**
   * When true, fallback language will be preloaded on Tolgee.run
   */
  preloadFallback?: boolean = false;
  private _targetElement?: Element;

  constructor(config?: TolgeeConfig) {
    //workaround for: https://stackoverflow.com/questions/48725916/typescript-optional-property-with-a-getter
    Object.defineProperty(this, 'targetElement', {
      set(targetElement: Element) {
        if (this.targetElement !== undefined) {
          throw new Error('Target element is already defined!');
        }
        if (targetElement === undefined) {
          this._targetElement = DEFAULT_TARGET_ELEMENT_SUPPLIER();
        }
        if (NodeHelper.isElementTargetElement(targetElement)) {
          // eslint-disable-next-line no-console
          console.error('Target element: ', this._targetElement);
          throw new Error(
            'An tolgee instance is inited with provided target element'
          );
        }
        this._targetElement = targetElement;
        NodeHelper.markElementAsTargetElement(this._targetElement);
      },
      get() {
        return this._targetElement;
      },
    });

    Object.assign(this, config || {});
    if (typeof sessionStorage !== 'undefined') {
      this.apiUrl =
        sessionStorage.getItem(API_URL_LOCAL_STORAGE) || this.apiUrl;
      this.apiKey =
        sessionStorage.getItem(API_KEY_LOCAL_STORAGE) || this.apiKey;
    }
    if (this._targetElement === undefined) {
      this._targetElement = DEFAULT_TARGET_ELEMENT_SUPPLIER();
    }
    this.fallbackLanguage = this.fallbackLanguage || this.defaultLanguage;
    if (this.watch === undefined) {
      this.watch = Boolean(this.apiKey && this.apiUrl);
    }
    if (this.availableLanguages === undefined && this.staticData) {
      this.availableLanguages = Object.keys(this.staticData);
    }
  }
}
