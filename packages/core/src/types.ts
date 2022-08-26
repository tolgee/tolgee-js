import type { EventEmitterType } from './EventEmitter';
import type { EventEmitterSelectiveType } from './EventEmitterSelective';
import type { Options } from './StateService/initState';

export type { State, Options } from './StateService/initState';
export type { EventEmitterType } from './EventEmitter';
export type { EventEmitterSelectiveType } from './EventEmitterSelective';

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

export type TranslationParams = {
  [key: string]: string | number | bigint;
};

export type WrapperPlugin = () => {
  unwrap: (text: string) => {
    text: string;
    keys: KeyAndParams[];
  };
  wrap: (
    key: string,
    translation: string,
    params?: Record<string, any>,
    defaultValue?: string | undefined
  ) => string;
};

export type FormatterPluginFormatParams = {
  translation: string;
  language: string;
  params: Record<string, any> | undefined;
};

export type FormatPlugin = () => {
  format: (props: FormatterPluginFormatParams) => string;
};

export type ObserverPlugin = () => Readonly<{
  stop: () => void;
  run: () => void;
  isObserving: () => boolean;
}>;

export type KeyUpdateEvent = {
  type: 'language' | 'key';
};

export type TolgeeInstance = Readonly<{
  onLanguageChange: EventEmitterType<string>;
  onPendingLanguageChange: EventEmitterType<string>;
  onFetchingChange: EventEmitterType<boolean>;
  onKeyUpdate: EventEmitterSelectiveType<KeyUpdateEvent>;
  onLoad: EventEmitterType<void>;

  setWrapper: (wrapper: WrapperPlugin | undefined) => Readonly<TolgeeInstance>;
  setFormat: (formatter: FormatPlugin | undefined) => Readonly<TolgeeInstance>;
  setObserver: (
    observer: () => Readonly<{
      stop: () => void;
      run: () => void;
      isObserving: () => boolean;
    }>
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

export type TranslationParamsTags<T> = {
  [key: string]: string | number | bigint | ((value: T | T[]) => T);
};

export type NodeLock = {
  locked?: boolean;
};

export type KeyAndParamsTags<T> = {
  key: string;
  params: TranslationParamsTags<T>;
  defaultValue?: string;
};

export type NodeMeta = {
  oldTextContent: string;
  keys: KeyAndParamsTags<any>[];
} & NodeLock;

export type NodeWithLock = Node & {
  _tolgee: NodeLock;
};

export type NodeWithMeta = Node & {
  _tolgee: NodeMeta;
};

export type ElementMeta = {
  wrappedWithElementOnlyKey?: string;
  wrappedWithElementOnlyDefaultHtml?: string;
  nodes: Set<NodeWithMeta>;
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

export type ElementWithMeta = Element &
  ElementCSSInlineStyle & {
    _tolgee: ElementMeta;
  };
