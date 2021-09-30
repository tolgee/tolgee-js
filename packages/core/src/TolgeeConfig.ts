import { Mode, TreeTranslationsData } from './types';
import { NodeHelper } from './helpers/NodeHelper';
import { ModifierKey } from './Constants/ModifierKey';

const DEFAULT_TARGET_ELEMENT_SUPPLIER = () => {
  if (typeof document !== 'undefined') {
    return document.body;
  }
};

export class TolgeeConfig {
  mode?: Mode;
  apiUrl?: string = 'https://app.tolgee.io';
  apiKey?: string;
  inputPrefix?: string = '%-%tolgee:';
  inputSuffix?: string = '%-%';
  forceLanguage?: string;
  defaultLanguage?: string = 'en';
  availableLanguages?: string[];
  fallbackLanguage?: string;
  filesUrlPrefix?: string = 'i18n/';
  watch?: boolean;
  ui?: new (...args) => any;
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
  highlightColor?: string = 'rgb(224 240 255)';
  /** localization data to use in production mode */
  staticData?: {
    [key: string]: TreeTranslationsData | (() => Promise<TreeTranslationsData>);
  };

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
    if (this._targetElement === undefined) {
      this._targetElement = DEFAULT_TARGET_ELEMENT_SUPPLIER();
    }
    this.mode = this.mode || (this.apiKey ? 'development' : 'production');
    this.fallbackLanguage = this.fallbackLanguage || this.defaultLanguage;
    if (this.watch === undefined) {
      this.watch = this.mode === 'development';
    }
  }
}
