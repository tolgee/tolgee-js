import { ChangeTranslationInterface, TreeTranslationsData } from './cache';
import {
  FetchFn,
  NsFallback,
  NsType,
  TranslateParams,
  TranslatePropsInternal,
} from './general';
import type { ObserverOptionsInternal } from '../Controller/State/observerOptions';
import { TolgeeInstance } from '../TolgeeCore';
import { TranslationDescriptor } from './events';

export type BackendDevProps = {
  apiUrl?: string;
  apiKey?: string;
  projectId?: number | string;
  filterTag?: string[];
};

export type CommonProps = {
  fetch: FetchFn;
};

export type BackendGetRecordProps = {
  language: string;
  namespace?: string;
};

export type BackendGetRecord = (
  data: BackendGetRecordProps & CommonProps
) => Promise<TreeTranslationsData | undefined>;

export interface BackendMiddleware {
  getRecord: BackendGetRecord;
}

export type BackendGetDevRecord = (
  data: BackendGetRecordProps & CommonProps & BackendDevProps
) => Promise<TreeTranslationsData | undefined>;

export type BackendGetRecordInternal = (
  data: BackendGetRecordProps & BackendDevProps
) => Promise<TreeTranslationsData | undefined>;

export type BackendDevMiddleware = {
  getRecord: BackendGetDevRecord;
};

export type KeyAndParams = {
  key: string;
  params?: TranslateParams;
  defaultValue?: string;
  ns?: NsType;
};

export type Unwrapped = { text: string; keys: KeyAndParams[] };

export type WrapperWrapProps = Pick<
  TranslatePropsInternal,
  'key' | 'params' | 'defaultValue' | 'ns' | 'translation'
>;
export type WrapperWrapFunction = (props: WrapperWrapProps) => string;
export type WrapperUnwrapFunction = (text: string) => Unwrapped;

export type HighlightInterface = (key?: string, ns?: NsFallback) => Highlighter;
export type FindPositionsInterface = (
  key?: string,
  ns?: NsFallback
) => KeyPosition[];

export type ObserverRunProps = {
  mouseHighlight: boolean;
  options: ObserverOptionsInternal;
  translate: (params: TranslatePropsInternal) => string;
  onClick: TranslationOnClick;
};

export type ObserverMiddleware = () => {
  unwrap: (text: string) => Unwrapped;
  wrap: WrapperWrapFunction;
  retranslate: () => void;
  stop: () => void;
  run: (props: ObserverRunProps) => void;
  highlight: HighlightInterface;
  outputNotFormattable: boolean;
  findPositions: FindPositionsInterface;
};

export type LanguageDetectorProps = {
  availableLanguages: string[];
  fetch: FetchFn;
};

export type LanguageDetectorMiddleware = {
  getLanguage: (
    props: LanguageDetectorProps
  ) => string | undefined | Promise<string | undefined>;
};

export type LanguageStorageMiddleware = {
  getLanguage: (
    props: CommonProps
  ) => string | undefined | Promise<string | undefined>;
  setLanguage: (language: string, props: CommonProps) => void | Promise<void>;
};

export type DevCredentials =
  | undefined
  | {
      apiUrl?: string;
      apiKey?: string;
      projectId?: string | number;
    };
export type WrapperMiddleware = {
  unwrap: WrapperUnwrapFunction;
  wrap: WrapperWrapFunction;
  testTextNode: (node: Text) => boolean;
  testAttribute: (node: Attr) => boolean;
};

export type FormatterMiddlewareFormatParams = {
  translation: string;
  language: string;
  params: Record<string, any> | undefined;
};

export type FormatterMiddleware = {
  format: (props: FormatterMiddlewareFormatParams) => string;
};

export type TranslationOnClick = (data: {
  keysAndDefaults: KeyAndParams[];
  target: HTMLElement;
}) => void;

export type Highlighter = {
  unhighlight(): void;
};

export type FinalFormatterMiddleware = {
  format: (props: FormatterMiddlewareFormatParams) => any;
};

export type KeyPosition = {
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  keyName: string;
  keyNamespace: string;
};

export type UiProps = {
  apiUrl: string;
  apiKey: string;
  projectId: number | string | undefined;
  highlight: HighlightInterface;
  findPositions: (key?: string | undefined, ns?: NsFallback) => KeyPosition[];
  changeTranslation: ChangeTranslationInterface;
  onPermanentChange: (props: TranslationDescriptor) => void;
  tagNewKeys?: string[];
  filterTag?: string[];
};

export type UiKeyOption = {
  key: string;
  defaultValue?: string;
  fallbackNamespaces: string[];
  namespace: string;
  translation: string | undefined;
};

export type UiMiddleware = (props: UiProps) => UiInterface;

export interface UiInterface {
  handleElementClick(
    keysAndDefaults: UiKeyOption[],
    target: HTMLElement
  ): Promise<void>;
}

export type PluginTools = Readonly<{
  setFinalFormatter: (formatter: FinalFormatterMiddleware | undefined) => void;
  addFormatter: (formatter: FormatterMiddleware | undefined) => void;
  setObserver: (observer: ObserverMiddleware | undefined) => void;
  hasObserver: () => boolean;
  setUi: (ui: UiMiddleware | undefined) => void;
  hasUi: () => boolean;
  addBackend: (backend: BackendMiddleware | undefined) => void;
  setDevBackend: (backend: BackendDevMiddleware | undefined) => void;
  setLanguageDetector: (
    languageDetector: LanguageDetectorMiddleware | undefined
  ) => void;
  setLanguageStorage: (
    languageStorage: LanguageStorageMiddleware | undefined
  ) => void;
}>;

export type TolgeePlugin = (
  tolgee: TolgeeInstance,
  tools: PluginTools
) => TolgeeInstance;

export type FormatErrorHandler = (
  error: string,
  info: TranslatePropsInternal
) => string;

export type OnFormatError = string | FormatErrorHandler;

export type MissingTranslationHandler = (
  info: TranslatePropsInternal
) => string;
