export interface TolgeeTextInputElement extends HTMLElement {
  __tolgee: TextInputElementData;
  selectionStart: number;
  value: string;
}

export interface TolgeeTextAreaElement
  extends TolgeeTextInputElement,
    HTMLTextAreaElement {
  addEventListener: any;
  removeEventListener: any;
}

export interface TolgeeInputElement
  extends TolgeeTextInputElement,
    HTMLInputElement {
  addEventListener: any;
  removeEventListener: any;
}

export interface TextInputElementData {
  oldValue: string;
  valueInputs: string[];
  touched: boolean;
  oldPlaceholder: string;
  placeholderInputs: string[];
}

export type Translations = { [key: string]: string | Translations };
export type TranslationParams = { [key: string]: string | number | bigint };

export type KeyAndParams = { key: string; params: TranslationParams };
export type TranslatedWithMetadata = {
  translated: string;
  key: string;
  params: TranslationParams;
};

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
  nodes: Set<NodeWithMeta>;
  listeningForHighlighting?: boolean;
  removeAllEventListeners?: () => void;
};

export type NodeMeta = {
  oldTextContent: string;
  keys: KeyAndParams[];
} & NodeLock;

export type NodeLock = {
  locked?: boolean;
};

export type Scope = 'translations.edit' | 'translations.view' | 'keys.edit';

export type Mode = 'development' | 'production';
