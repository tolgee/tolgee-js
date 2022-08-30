import type { EventEmitterType } from './EventEmitter';
import type { EventEmitterSelectiveType } from './EventEmitterSelective';
import type { Options } from './StateService/initState';

export type { State, Options } from './StateService/initState';
export type { EventEmitterType } from './EventEmitter';
export type { EventEmitterSelectiveType } from './EventEmitterSelective';

export type TranslateProps = {
  key: string;
  params?: TranslationParams;
  translation?: string;
  defaultValue?: string;
  namespace?: string;
  noWrap?: boolean;
};

export type TreeTranslationsData = {
  [key: string]: string | TreeTranslationsData;
};

export type TranslationsFlat = Map<string, string>;

export type CacheRecordOrigin = 'initial' | 'prod' | 'dev';

export type CacheRecord = {
  origin: CacheRecordOrigin;
  data: TranslationsFlat;
};

export type StateCache = Map<string, CacheRecord>;
export type CacheAsyncRequests = Map<
  string,
  Promise<TreeTranslationsData> | undefined
>;

export type CacheDescriptor = {
  language: string;
  namespace?: string;
};

export type CacheKeyObject = {
  language: string;
  namespace: string;
};

export type KeyAndParams = {
  key: string;
  params?: TranslationParams;
  defaultValue?: string;
};

export type Unwrapped = { text: string; keys: KeyAndParams[] };

export type TranslationParams = {
  [key: string]: string | number | bigint;
};

export type WrapperWrapFunction = (props: TranslateProps) => string;
export type WrapperUnwrapFunction = (text: string) => Unwrapped;

export type WrapperAttributeXPathGetter = (props: {
  tag: string;
  attribute: string;
}) => string;

export type WrapperInterface = {
  unwrap: WrapperUnwrapFunction;
  wrap: WrapperWrapFunction;
  getTextXPath: () => string;
  getAttributeXPath: WrapperAttributeXPathGetter;
};

export type FormatterPluginFormatParams = {
  translation: string;
  language: string;
  params: Record<string, any> | undefined;
};

export type FormatPlugin = () => {
  format: (props: FormatterPluginFormatParams) => string;
};

export type ObserverProps = {
  translate: (params: TranslateProps) => string;
};

export type ObserverPlugin = (props: ObserverProps) => {
  unwrap: (text: string) => Unwrapped;
  wrap: (props: TranslateProps) => string;
  stop: () => void;
};

export type KeyUpdateEvent = {
  type: 'language' | 'key';
};

export type TolgeeInstance = Readonly<{
  onLanguageChange: EventEmitterType<string>;
  onPendingLanguageChange: EventEmitterType<string>;
  onFetchingChange: EventEmitterType<boolean>;
  onKeyUpdate: EventEmitterSelectiveType<KeyUpdateEvent>;
  onLoad: EventEmitterType<void>;

  setFormat: (formatter: FormatPlugin | undefined) => Readonly<TolgeeInstance>;
  setObserver: (
    observer: ObserverPlugin | undefined
  ) => Readonly<TolgeeInstance>;

  getLanguage: () => string;
  getPendingLanguage: () => string;
  changeLanguage: (language: string) => Promise<void>;
  changeTranslation: (
    descriptor: CacheDescriptor,
    key: string,
    value: string
  ) => void;
  addActiveNs: (namespace: string) => Promise<void>;
  removeActiveNs: (ns: string) => void;
  loadRecord: (
    descriptor: CacheDescriptor
  ) => Promise<TreeTranslationsData | TranslationsFlat | undefined>;
  isLoading: () => boolean;
  isFetching: () => boolean;
  init: (options: Options) => Readonly<any>;
  run: () => Promise<void>;
  stop: () => void;
  instant: (key: string, namespace?: string) => string;
}>;

export type NodeLock = {
  locked?: boolean;
};

export type NodeMeta = {
  oldTextContent: string;
  keys: KeyAndParams[];
};

export type ElementMeta = {
  wrappedWithElementOnlyKey?: string;
  wrappedWithElementOnlyDefaultHtml?: string;
  nodes: Map<Node, NodeMeta>;
  highlightEl?: HTMLDivElement;
  highlight?: () => void;
  unhighlight?: () => void;
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

export type TolgeeElement = Element &
  ElementCSSInlineStyle & {
    _tolgee?: boolean;
  };

export type ObserverOptions = {
  tagAttributes: Record<string, string[]>;
  highlightKeys: ModifierKey[];
  highlightColor: string;
  highlightWidth: number;
  targetElement: HTMLElement;
  inputPrefix: string;
  inputSuffix: string;
};

export type ObserverOptionsInitial = Partial<ObserverOptions>;

export type RegistredElementsMap = Map<TolgeeElement, ElementMeta>;

export enum ModifierKey {
  Alt,
  Control,
  Shift,
  Meta,
}
