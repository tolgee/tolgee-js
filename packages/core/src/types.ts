import type { Options } from './StateService/State/initState';

export type { State, Options } from './StateService/State/initState';
export type { EventEmitterType } from './EventService/EventEmitter';
export type { EventEmitterSelectiveType } from './EventService/EventEmitterSelective';

export type FallbackGeneral = undefined | false | string | string[];

export type FallbackNS = FallbackGeneral;

export type NsType = string;

export type KeyType = string;

export type FallbackNSTranslation = undefined | NsType | NsType[];

export type FallbackLanguage = FallbackGeneral;

export type FallbackLanguageObject = Record<string, FallbackLanguage>;

export type FallbackLanguageOption = FallbackLanguage | FallbackLanguageObject;

export type TranslateOptions<T> = {
  ns?: FallbackNSTranslation;
  noWrap?: boolean;
  orEmpty?: boolean;
  fallbackLanguages?: FallbackLanguage;
  params?: TranslateParams<T>;
};

export type TranslateProps<T = DefaultParamType> = {
  key: KeyType;
  defaultValue?: string;
} & TranslateOptions<T>;

export type TranslatePropsInternal = TranslateProps & {
  translation?: string;
};

export type TranslationValue = string | undefined | null;

export type TranslationsFlat = Map<string, TranslationValue>;

export type TreeTranslationsData = {
  [key: string]: TranslationValue | TreeTranslationsData;
};

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
  params?: TranslateParams;
  defaultValue?: string;
  ns?: FallbackNSTranslation;
};

export type Unwrapped = { text: string; keys: KeyAndParams[] };

type PropType<TObj> = TObj[keyof TObj];

export type DefaultParamType = string | number | bigint;

export type TranslateParams<T = DefaultParamType> = {
  [key: string]: T;
};

export type CombinedOptions<T> = TranslateOptions<T> & {
  [key: string]: T | PropType<TranslateOptions<T>>;
};

export type TFnType<T, R> = {
  (key: string, defaultValue?: string, options?: CombinedOptions<T>): R;
  (key: string, options?: CombinedOptions<T>): R;
  (props: TranslateProps<T>): R;
};

export type WrapperWrapFunction = (props: TranslatePropsInternal) => string;
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

export type FormatterInterfaceFormatParams = {
  translation: string;
  language: string;
  params: Record<string, any> | undefined;
};

export type FormatterInterface = {
  format: (props: FormatterInterfaceFormatParams) => string;
};

export type FinalFormatterInterface = {
  format: (props: FormatterInterfaceFormatParams) => any;
};

export type ObserverProps = {
  translate: (params: TranslatePropsInternal) => string;
  onClick: TranslationOnClick;
};

export type HighlightInterface = (key?: string) => {
  unhighlight(): void;
};

export type ObserverInterface = (props: ObserverProps) => {
  unwrap: (text: string) => Unwrapped;
  wrap: (props: TranslatePropsInternal) => string;
  retranslate: () => void;
  stop: () => void;
  run: () => void;
  highlight: HighlightInterface;
};

export type BackendDevProps = {
  apiUrl?: string;
  apiKey?: string;
  projectId?: number;
};

export type BackendGetRecordProps = {
  language: string;
  namespace?: string;
};

export type BackendGetRecord = (
  data: BackendGetRecordProps
) => Promise<TreeTranslationsData> | undefined;

export type BackendInterface = {
  getRecord: BackendGetRecord;
};

export type BackendGetDevRecord = (
  data: BackendGetRecordProps & BackendDevProps
) => Promise<TreeTranslationsData> | undefined;

export type BackendDevInterface = {
  getRecord: BackendGetDevRecord;
};

export type TolgeeEvent =
  | 'pendingLanguage'
  | 'language'
  | 'key'
  | 'loading'
  | 'fetching'
  | 'initialLoad'
  | 'running'
  | 'cache'
  | 'keyUpdate';

export type TolgeeOn = {
  (event: 'pendingLanguage', handler: ListenerHandler<string>): Listener;
  (event: 'language', handler: ListenerHandler<string>): Listener;
  (event: 'key', handler: ListenerHandler<string>): Listener;
  (event: 'loading', handler: ListenerHandler<boolean>): Listener;
  (event: 'fetching', handler: ListenerHandler<boolean>): Listener;
  (event: 'initialLoad', handler: ListenerHandler<void>): Listener;
  (event: 'running', handler: ListenerHandler<boolean>): Listener;
  (event: 'cache', handler: ListenerHandler<CacheKeyObject>): Listener;
  (event: 'keyUpdate', handler: ListenerHandler<void>): Listener;
  (event: TolgeeEvent, handler: ListenerHandler<any>): Listener;
};

export type TolgeeInstance = Readonly<{
  on: TolgeeOn;
  onKeyUpdate: (handler: ListenerHandler<void>) => ListenerSelective;

  use: (plugin: TolgeePlugin | undefined) => TolgeeInstance;

  getLanguage: () => string;
  getPendingLanguage: () => string;
  changeLanguage: (language: string) => Promise<void>;
  changeTranslation: (
    descriptor: CacheDescriptor,
    key: string,
    value: string
  ) => void;
  addActiveNs: (ns: FallbackNSTranslation, forget?: boolean) => Promise<void>;
  removeActiveNs: (ns: FallbackNSTranslation) => void;
  loadRecords: (descriptors: CacheDescriptor[]) => Promise<TranslationsFlat[]>;
  loadRecord: (descriptors: CacheDescriptor) => Promise<TranslationsFlat>;
  isInitialLoading: () => boolean;
  isLoading: (ns?: FallbackNSTranslation) => boolean;
  isLoaded: (ns?: FallbackNSTranslation) => boolean;
  isFetching: (ns?: FallbackNSTranslation) => boolean;
  isRunning: () => boolean;
  highlight: HighlightInterface;
  init: (options: Partial<Options>) => TolgeeInstance;
  run: () => Promise<void>;
  stop: () => void;
  t: (props: TranslatePropsInternal) => string;
}>;

export type PluginServicePublic = Readonly<{
  setFinalFormatter: (formatter: FinalFormatterInterface | undefined) => void;
  addFormatter: (formatter: FormatterInterface | undefined) => void;
  setObserver: (observer: ObserverInterface | undefined) => void;
  setUi: (ui: UiLibInterface | undefined) => void;
  addBackend: (backend: BackendInterface | undefined) => void;
  setDevBackend: (backend: BackendInterface | undefined) => void;
}>;

export type NodeMeta = {
  oldTextContent: string;
  keys: KeyAndParams[];
  keyAttributeOnly?: boolean;
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

export type UiProps = {
  apiUrl: string;
  apiKey: string;
  highlightByKey: HighlightInterface;
};

export interface UiInterface {
  handleElementClick(
    event: MouseEvent,
    keysAndDefaults: UiKeyOption[]
  ): Promise<void>;
}

export type UiConstructor = new (props: UiProps) => UiInterface;

export type UiLibInterface = {
  UI: UiConstructor;
};

export type UiType = UiConstructor | UiLibInterface;

export type UiKeyOption = {
  key: string;
  defaultValue?: string;
  ns: string[];
  translation: string | undefined;
};

export type KeyWithDefault = {
  key: string;
  defaultValue?: string;
  ns: FallbackNSTranslation;
};

export type TranslationOnClick = (
  event: MouseEvent,
  data: {
    keysAndDefaults: KeyWithDefault[];
    el: Element;
    meta: ElementMeta;
  }
) => void;

export type Listener = {
  unsubscribe: () => void;
};

export type KeyDescriptorInternal = {
  key?: string;
  ns?: string[] | undefined;
};

export type KeyDescriptor = {
  key: string;
  ns?: string | string[];
};

export type ListenerSelective = {
  unsubscribe: () => void;
  subscribeNs: (ns: FallbackNSTranslation) => ListenerSelective;
  unsubscribeNs: (ns: FallbackNSTranslation) => ListenerSelective;
  subscribeKey: (descriptor: KeyDescriptor) => ListenerSelective;
  unsubscribeKey: (descriptor: KeyDescriptor) => ListenerSelective;
};

export type ListenerHandlerEvent<T> = { value: T };
export type ListenerHandler<T> = (e: ListenerHandlerEvent<T>) => void;

export type TolgeePlugin = (
  tolgee: TolgeeInstance,
  tools: PluginServicePublic
) => TolgeeInstance;
