export type ObserverOptionsInternal = {
  /**
   * Attributes that are observed on html elements
   */
  tagAttributes: Record<string, string[]>;

  /**
   * Key(s) which trigger in-context translating (default: ['Alt'])
   */
  highlightKeys: ModifierKey[];

  /**
   * Color used for key highlighting (default: 'rgb(255, 0, 0)')
   */
  highlightColor: string;

  /**
   * Highliter border width (default: 5)
   */
  highlightWidth: number;

  /**
   * Root element which will be observed (default: document)
   */
  targetElement?: Node;

  /**
   * Elements which are not observed (default: ['script', 'style'])
   */
  restrictedElements: string[];

  /**
   * Text observer prefix (default: '%-%tolgee:')
   */
  inputPrefix: string;

  /**
   * Text observer suffix (default: '%-%')
   */
  inputSuffix: string;

  /**
   * Html elements which will pass click listener to their parent (default: ['option', 'optgroup'])
   */
  passToParent: (keyof HTMLElementTagNameMap)[] | ((node: Element) => boolean);

  /**
   * Encodes full key info into the invisble characters (default: false)
   */
  fullKeyEncode: boolean;
};

export type ObserverOptions = Partial<ObserverOptionsInternal>;

export type ModifierKey = 'Alt' | 'Control' | 'Shift' | 'Meta';

export const defaultObserverOptions: ObserverOptionsInternal = {
  tagAttributes: {
    textarea: ['placeholder'],
    input: ['value', 'placeholder'],
    img: ['alt'],
    '*': ['aria-label', 'title'],
  },
  restrictedElements: ['script', 'style'],
  highlightKeys: ['Alt'] as ModifierKey[],
  highlightColor: 'rgb(255, 0, 0)',
  highlightWidth: 5,
  inputPrefix: '%-%tolgee:',
  inputSuffix: '%-%',
  passToParent: ['option', 'optgroup'],
  fullKeyEncode: false,
};
