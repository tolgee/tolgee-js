import type { TolgeeOptions } from './Controller/State/initState';
import type { ObserverOptions } from './Controller/State/initObserverOptions';

export type { State, TolgeeOptions } from './Controller/State/initState';
export type {
  ObserverOptions,
  ModifierKey,
} from './Controller/State/initObserverOptions';

export type { EventEmitterInstance } from './Controller/Events/EventEmitter';
export type { EventEmitterSelectiveInstance } from './Controller/Events/EventEmitterSelective';

export type TolgeeInstance = Readonly<{
  /**
   * Listen to tolgee events.
   */
  on: TolgeeOn;
  /**
   * Listen for specific keys/namespaces changes.
   */
  onKeyUpdate: (handler: ListenerHandler<void>) => ListenerSelective;

  /**
   * Add tolgee plugin.
   */
  use: (plugin: TolgeePlugin | undefined) => TolgeeInstance;

  /**
   * @return current language if set.
   */
  getLanguage: () => string | undefined;
  /**
   * `pendingLanguage` represents language which is currently being loaded.
   * @return current `pendingLanguage` if set.
   */
  getPendingLanguage: () => string | undefined;
  /**
   * Change current language.
   * - if tolgee is not running sets `pendingLanguage`, `language` to the new value
   * - if tolgee is running sets `pendingLanguage` to the value, fetches necessary data and then changes `language`
   * @return Promise which is resolved when `language` is changed.
   */
  changeLanguage: (language: string) => Promise<void>;
  changeTranslation: ChangeTranslationInterface;
  /**
   * Adds namespace(s) list of active namespaces. And if tolgee is running, loads required data.
   */
  addActiveNs: (ns: FallbackNsTranslation, forget?: boolean) => Promise<void>;
  /**
   * Remove namespace(s) from active namespaces.
   * Tolgee internally counts how many times was each active namespace added, so this method will remove namespace only if the counter goes down to 0.
   *
   * ```
   * tolgee.addActiveNs('common');
   * tolgee.addActiveNs(['common', 'component']);
   * // active namespaces: {common: 2, component: 1}
   * tolgee.removeActiveNs(['common', 'component']);
   * // active namespaces: {common: 1}
   * tolgee.removeActiveNs('common');
   * // active namespaces: {}
   * ```
   *
   * This is used in component lifecycles, where we want to keep track which namespaces are needed, when language changes.
   */
  removeActiveNs: (ns: FallbackNsTranslation) => void;
  loadRecords: (descriptors: CacheDescriptor[]) => Promise<TranslationsFlat[]>;
  loadRecord: (descriptors: CacheDescriptor) => Promise<TranslationsFlat>;
  addStaticData: (data: TolgeeOptions['staticData']) => void;
  getRecord: (descriptor: CacheDescriptor) => TranslationsFlat | undefined;
  getAllRecords: () => CachePublicRecord[];
  isInitialLoading: () => boolean;
  isLoading: (ns?: FallbackNsTranslation) => boolean;
  isLoaded: (ns?: FallbackNsTranslation) => boolean;
  isFetching: (ns?: FallbackNsTranslation) => boolean;
  isRunning: () => boolean;
  highlight: HighlightInterface;
  getInitialOptions: () => TolgeeOptions;
  isDev: () => boolean;
  /**
   * Updates options after instance creation. Extends existing options,
   * so it only changes the fields, that are listed.
   * Useful when using with plugins. When called in running state, tolgee stops and runs again.
   */
  init: (options: Partial<TolgeeOptions>) => TolgeeInstance;
  /**
   * Changes internal state to running: true and loads initial files.
   * Runs runnable plugins mainly Observer if present.
   */
  run: () => Promise<void>;
  /**
   * Changes internal state to running: false and stops runnable plugins.
   */
  stop: () => void;
  /**
   * Returns translated and formatted key.
   * If Observer is present and tolgee is running, wraps result to be identifiable in the DOM.
   */
  t: TFnType;
  wrap: (params: TranslatePropsInternal) => string | undefined;
  unwrap: (text: string) => Unwrapped;
  setObserverOptions: (options: Partial<ObserverOptions>) => TolgeeInstance;
}>;

export type PluginTools = Readonly<{
  setFinalFormatter: (formatter: FinalFormatterInterface | undefined) => void;
  addFormatter: (formatter: FormatterInterface | undefined) => void;
  setObserver: (observer: ObserverInterface | undefined) => void;
  hasObserver: () => boolean;
  setUi: (ui: UiLibInterface | undefined) => void;
  hasUi: () => boolean;
  addBackend: (backend: BackendInterface | undefined) => void;
  setDevBackend: (backend: BackendInterface | undefined) => void;
  setLanguageDetector: (
    languageDetector: LanguageDetectorInterface | undefined
  ) => void;
  setLanguageStorage: (
    languageStorage: LanguageStorageInterface | undefined
  ) => void;
  overrideCredentials: (credentials: DevCredentials) => void;
}>;

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
  (event: 'cache', handler: ListenerHandler<CacheDescriptorWithKey>): Listener;
  (event: 'keyUpdate', handler: ListenerHandler<void>): Listener;
  (event: TolgeeEvent, handler: ListenerHandler<any>): Listener;
};

export type TolgeePlugin = (
  tolgee: TolgeeInstance,
  tools: PluginTools
) => TolgeeInstance;

export type FallbackGeneral = undefined | false | string | string[];

export type FallbackNs = FallbackGeneral;

export type NsType = string;

export type KeyType = string;

export type FallbackNsTranslation = undefined | NsType | NsType[];

export type FallbackLanguage = FallbackGeneral;

export type FallbackLanguageObject = Record<string, FallbackLanguage>;

export type FallbackLanguageOption = FallbackLanguage | FallbackLanguageObject;

export type TranslateOptions = {
  ns?: FallbackNsTranslation;
  noWrap?: boolean;
  orEmpty?: boolean;
};

export type TranslateProps<T = DefaultParamType> = {
  key: KeyType;
  defaultValue?: string;
  params?: TranslateParams<T>;
} & TranslateOptions;

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
  Promise<TreeTranslationsData | undefined> | undefined
>;

export type CacheDescriptor = {
  language: string;
  namespace?: string;
};

export type CacheDescriptorInternal = {
  language: string;
  namespace: string;
};

export type CacheDescriptorWithKey = CacheDescriptorInternal & {
  key?: string;
};

export type KeyAndParams = {
  key: string;
  params?: TranslateParams;
  defaultValue?: string;
  ns?: FallbackNsTranslation;
};

export type Unwrapped = { text: string; keys: KeyAndParams[] };

type PropType<TObj> = TObj[keyof TObj];

export type DefaultParamType = string | number | bigint;

export type TranslateParams<T = DefaultParamType> = {
  [key: string]: T;
};

export type CombinedOptions<T> = TranslateOptions & {
  [key: string]: T | PropType<TranslateOptions>;
};

export type TFnType<T = DefaultParamType, R = string> = {
  (key: string, defaultValue?: string, options?: CombinedOptions<T>): R;
  (key: string, options?: CombinedOptions<T>): R;
  (props: TranslateProps<T>): R;
};

export type WrapperWrapProps = Pick<
  TranslatePropsInternal,
  'key' | 'params' | 'defaultValue' | 'ns' | 'translation'
>;
export type WrapperWrapFunction = (props: WrapperWrapProps) => string;
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
  options: ObserverOptions;
};

export type HighlightInterface = (
  key?: string,
  ns?: FallbackNsTranslation
) => {
  unhighlight(): void;
};

export type ObserverRunProps = {
  mouseHighlight: boolean;
};

export type ObserverInterface = (props: ObserverProps) => {
  unwrap: (text: string) => Unwrapped;
  wrap: WrapperWrapFunction;
  retranslate: () => void;
  stop: () => void;
  run: (props: ObserverRunProps) => void;
  highlight: HighlightInterface;
  outputNotFormattable: boolean;
};

export type LanguageDetectorProps = {
  availableLanguages: string[];
};

export type LanguageDetectorInterface = {
  getLanguage: (
    props: LanguageDetectorProps
  ) => string | undefined | Promise<string | undefined>;
};

export type LanguageStorageInterface = {
  getLanguage: () => string | undefined | Promise<string | undefined>;
  setLanguage: (language: string) => void | Promise<void>;
};

export type DevCredentials =
  | undefined
  | {
      apiUrl?: string;
      apiKey?: string;
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
) => Promise<TreeTranslationsData | undefined> | undefined;

export interface BackendInterface {
  getRecord: BackendGetRecord;
}

export type BackendGetDevRecord = (
  data: BackendGetRecordProps & BackendDevProps
) => Promise<TreeTranslationsData | undefined> | undefined;

export type BackendDevInterface = {
  getRecord: BackendGetDevRecord;
};

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

export type ChangeTranslationInterface = (
  descriptor: CacheDescriptor,
  key: string,
  value: string
) => { revert: () => void };

export type UiProps = {
  apiUrl: string;
  apiKey: string;
  highlight: HighlightInterface;
  changeTranslation: ChangeTranslationInterface;
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
  ns: FallbackNsTranslation;
  translation: string | undefined;
};

export type KeyWithDefault = {
  key: string;
  defaultValue?: string;
  ns: FallbackNsTranslation;
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
  subscribeNs: (ns: FallbackNsTranslation) => ListenerSelective;
  subscribeKey: (descriptor: KeyDescriptor) => ListenerSelective;
};

export type ListenerHandlerEvent<T> = { value: T };
export type ListenerHandler<T> = (e: ListenerHandlerEvent<T>) => void;

export type CachePublicRecord = {
  data: TranslationsFlat;
  language: string;
  namespace: string;
};
