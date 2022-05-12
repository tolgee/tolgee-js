export interface TextInputElementData {
  oldValue: string;
  valueInputs: string[];
  touched: boolean;
  oldPlaceholder: string;
  placeholderInputs: string[];
}

export type TreeTranslationsData = {
  [key: string]: string | TreeTranslationsData;
};

export type Translations = Record<string, string>;
export type TranslationParams = {
  [key: string]: string | number | bigint;
};
export type TranslationParamsTags<T> = {
  [key: string]: string | number | bigint | ((value: T | T[]) => T);
};

export type TranslateProps = {
  key: string;
  defaultValue?: string;
  params?: TranslationParams;
  noWrap?: boolean;
  orEmpty?: boolean;
};
export type TranslatePropsTags<T> = {
  key: string;
  defaultValue?: string;
  params?: TranslationParamsTags<T>;
  noWrap?: boolean;
  orEmpty?: boolean;
};

export type InstantProps = {
  key: string;
  defaultValue?: string;
  params?: TranslationParams;
  noWrap?: boolean;
  orEmpty?: boolean;
};
export type InstantPropsTags<T> = {
  key: string;
  defaultValue?: string;
  params?: TranslationParamsTags<T>;
  noWrap?: boolean;
  orEmpty?: boolean;
};

export type KeyAndParams = {
  key: string;
  params: TranslationParams;
  defaultValue?: string;
};
export type KeyAndParamsTags<T> = {
  key: string;
  params: TranslationParamsTags<T>;
  defaultValue?: string;
};

export type TranslatedWithMetadata = {
  translated: string;
  key: string;
  params: TranslationParams;
  defaultValue: string | undefined;
};
export type TranslatedWithMetadataTags<T> = {
  translated: TranslationTags<T>;
  key: string;
  params: TranslationParamsTags<T>;
  defaultValue: string | undefined;
};

export type TranslationTags<T> = string | T[];

export type NodeWithMeta = Node & {
  _tolgee: NodeMeta;
};

export type NodeWithLock = Node & {
  _tolgee: NodeLock;
};

export type ElementWithMeta = Element &
  ElementCSSInlineStyle & {
    _tolgee: ElementMeta;
  };

export type ElementMeta = {
  wrappedWithElementOnlyKey?: string;
  wrappedWithElementOnlyDefaultHtml?: string;
  nodes: Set<NodeWithMeta>;
  listeningForHighlighting?: boolean;
  removeAllEventListeners?: () => void;
  highlightEl?: HTMLDivElement;
  highlight?: () => void;
  unhighlight?: () => void;
  initialBackgroundColor?: string;
  /**
   * Stops removing of element's inactive nodes and
   * unregistering from ElementRegistrar.
   *
   * It's used when user has mouse on the element, so there is
   * potential, that element highlight will be triggered.
   *
   * Triggering highlight needs the metadata stored on element, so
   * we need the ability to prevent clean.
   */
  preventClean?: boolean;
};

export type NodeMeta = {
  oldTextContent: string;
  keys: KeyAndParamsTags<any>[];
} & NodeLock;

export type NodeLock = {
  locked?: boolean;
};

export type Scope =
  | 'translations.edit'
  | 'translations.view'
  | 'keys.edit'
  | 'screenshots.upload'
  | 'screenshots.view'
  | 'screenshots.delete';

export type Mode = 'development' | 'production';

export type Unwrapped = { text: string; keys: KeyAndParamsTags<any>[] };

export interface Formatter {
  format: FormatFunction;
}

interface FormatterStatic {
  type: 'formatter';
  new (): Formatter;
}

export type TolgeeModule = FormatterStatic;

export type FormatFunction = (props: {
  translation: string;
  params: Record<string, any>;
  language: string;
}) => string | any[];
