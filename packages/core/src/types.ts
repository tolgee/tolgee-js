import type { EventEmitterType } from './EventEmitter';
import type { EventEmitterSelectiveType } from './EventEmitterSelective';
import type { Options } from './StateService/initState';

export type { State, Options } from './StateService/initState';
export type { EventEmitterType } from './EventEmitter';
export type { EventEmitterSelectiveType } from './EventEmitterSelective';

export type FallbackGeneral = undefined | false | string | string[];

export type FallbackNS = FallbackGeneral;

export type FallbackNSTranslation = undefined | string | string[];

export type FallbackLanguage = FallbackGeneral;

export type FallbackLanguageObject = Record<string, FallbackLanguage>;

export type FallbackLanguageOption = FallbackLanguage | FallbackLanguageObject;

export type TranslateProps = {
  key: string;
  params?: TranslationParams;
  defaultValue?: string;
  ns?: FallbackNSTranslation;
  noWrap?: boolean;
  orEmpty?: boolean;
  fallbackLanguages?: FallbackLanguage;
};

export type TranslatePropsInternal = TranslateProps & {
  translation?: string;
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
  ns?: FallbackNSTranslation;
};

export type Unwrapped = { text: string; keys: KeyAndParams[] };

export type TranslationParams = {
  [key: string]: string | number | bigint;
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

export type FormatterPluginFormatParams = {
  translation: string;
  language: string;
  params: Record<string, any> | undefined;
};

export type FormatPlugin = () => {
  format: (props: FormatterPluginFormatParams) => string;
};

export type ObserverProps = {
  translate: (params: TranslatePropsInternal) => string;
  onClick: TranslationOnClick;
};

export type ObserverPlugin = (props: ObserverProps) => {
  unwrap: (text: string) => Unwrapped;
  wrap: (props: TranslatePropsInternal) => string;
  retranslate: () => void;
  stop: () => void;
};

export type BackendDevProps = {
  apiUrl?: string;
  apiKey?: string;
};

export type BackendGetRecordProps = {
  language: string;
  namespace?: string;
};

export type BackendGetRecord = (
  data: BackendGetRecordProps
) => Promise<TreeTranslationsData> | undefined;

export type BackendPlugin = () => {
  getRecord: BackendGetRecord;
};

export type BackendDevPlugin = (props: BackendDevProps) => {
  getRecord: BackendGetRecord;
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
  setUi: (ui: UiLibInterface | undefined) => Readonly<TolgeeInstance>;
  addBackend: (backend: BackendPlugin | undefined) => Readonly<TolgeeInstance>;
  setDevBackend: (
    backend: BackendPlugin | undefined
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
  init: (options: Partial<Options>) => Readonly<TolgeeInstance>;
  run: () => Promise<void>;
  stop: () => void;
  instant: (props: TranslatePropsInternal) => string;
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
  passToParent: (keyof HTMLElementTagNameMap)[] | ((node: Element) => boolean);
};

export type ObserverOptionsInitial = Partial<ObserverOptions>;

export type RegistredElementsMap = Map<TolgeeElement, ElementMeta>;

export enum ModifierKey {
  Alt,
  Control,
  Shift,
  Meta,
}

export type UiProps = {
  getTranslation(key: string): string;
};

export type UiInstance = {
  handleElementClick(
    event: MouseEvent,
    keysAndDefaults: KeyWithDefault[]
  ): Promise<void>;
};

export type UiConstructor = new (props: UiProps) => UiInstance;

export type UiLibInterface = {
  UI: UiConstructor;
};

export type UiType = UiConstructor | UiLibInterface;

export type KeyWithDefault = { key: string; defaultValue?: string };

export type TranslationOnClick = (
  event: MouseEvent,
  data: {
    keysAndDefaults: KeyWithDefault[];
    el: TolgeeElement;
    meta: ElementMeta;
  }
) => void;
