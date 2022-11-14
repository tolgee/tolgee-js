import { TolgeeInstance } from './Tolgee';
export type { TolgeeChainer, TolgeeInstance } from './Tolgee';
import type { ObserverOptionsInternal } from './Controller/State/observerOptions';

export type {
  State,
  TolgeeOptions,
  TolgeeOptionsInternal,
  TolgeeStaticData,
} from './Controller/State/initState';

export type {
  ObserverOptions,
  ObserverOptionsInternal,
  ModifierKey,
} from './Controller/State/observerOptions';

export type { EventEmitterInstance } from './Controller/Events/EventEmitter';
export type { EventEmitterSelectiveInstance } from './Controller/Events/EventEmitterSelective';

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
  onPrepare: (callback: () => void) => void;
}>;

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
  ns?: NsType;
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

export type KeyAndNamespacesInternal = Pick<
  TranslatePropsInternal,
  'key' | 'ns'
>;

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
  ns?: NsType;
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
  options: ObserverOptionsInternal;
};

export type Highlighter = {
  unhighlight(): void;
};

export type HighlightInterface = (
  key?: string,
  ns?: FallbackNsTranslation
) => Highlighter;

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
      projectId?: string | number;
    };

export type BackendDevProps = {
  apiUrl?: string;
  apiKey?: string;
  projectId?: number | string;
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

export type TranslationChanger = {
  revert: () => void;
};

export type ChangeTranslationInterface = (
  descriptor: CacheDescriptor,
  key: string,
  value: string
) => TranslationChanger;

export type UiProps = {
  apiUrl: string;
  apiKey: string;
  projectId: number | string | undefined;
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
  ns: string[];
  translation: string | undefined;
};

export type TranslationOnClick = (
  event: MouseEvent,
  data: {
    keysAndDefaults: KeyAndParams[];
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
  ns?: NsType | undefined;
};

export type ListenerSelective = {
  unsubscribe: () => void;
  /**
   * Subscribes to namespace(s) (if not specified to defaultNs)
   */
  subscribeNs: (ns?: FallbackNsTranslation) => ListenerSelective;
  /**
   * Subscribes to namespace (if not specified to defaultNs)
   */
  subscribeKey: (descriptor: KeyDescriptor) => ListenerSelective;
};

export type ListenerHandlerEvent<T> = { value: T };
export type ListenerHandler<T> = (e: ListenerHandlerEvent<T>) => void;

export type CachePublicRecord = {
  data: TranslationsFlat;
  language: string;
  namespace: string;
};
