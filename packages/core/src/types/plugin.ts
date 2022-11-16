import { ChangeTranslationInterface, TreeTranslationsData } from './cache';
import {
  NsFallback,
  NsType,
  TranslateParams,
  TranslatePropsInternal,
} from './general';
import type { ObserverOptionsInternal } from '../Controller/State/observerOptions';
import { TolgeeInstance } from '../Tolgee';

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

export interface BackendMiddleware {
  getRecord: BackendGetRecord;
}

export type BackendGetDevRecord = (
  data: BackendGetRecordProps & BackendDevProps
) => Promise<TreeTranslationsData | undefined> | undefined;

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

export type WrapperAttributeXPathGetter = (props: {
  tag: string;
  attribute: string;
}) => string;

export type HighlightInterface = (key?: string, ns?: NsFallback) => Highlighter;

export type ObserverRunProps = {
  mouseHighlight: boolean;
};

export type ObserverMiddleware = (props: ObserverProps) => {
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

export type LanguageDetectorMiddleware = {
  getLanguage: (
    props: LanguageDetectorProps
  ) => string | undefined | Promise<string | undefined>;
};

export type LanguageStorageMiddleware = {
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
export type WrapperMiddleware = {
  unwrap: WrapperUnwrapFunction;
  wrap: WrapperWrapFunction;
  getTextXPath: () => string;
  getAttributeXPath: WrapperAttributeXPathGetter;
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
  event: any;
}) => void;

export type ObserverProps = {
  translate: (params: TranslatePropsInternal) => string;
  onClick: TranslationOnClick;
  options: ObserverOptionsInternal;
};

export type Highlighter = {
  unhighlight(): void;
};

export type FinalFormatterMiddleware = {
  format: (props: FormatterMiddlewareFormatParams) => any;
};

export type UiProps = {
  apiUrl: string;
  apiKey: string;
  projectId: number | string | undefined;
  highlight: HighlightInterface;
  changeTranslation: ChangeTranslationInterface;
};

export type UiKeyOption = {
  key: string;
  defaultValue?: string;
  ns: string[];
  translation: string | undefined;
};

export interface UiMiddleware {
  handleElementClick(keysAndDefaults: UiKeyOption[], event: any): Promise<void>;
}

export type UiConstructor = new (props: UiProps) => UiMiddleware;

export type UiLibMiddleware = {
  UI: UiConstructor;
};

export type UiType = UiConstructor | UiLibMiddleware;

export type PluginTools = Readonly<{
  setFinalFormatter: (formatter: FinalFormatterMiddleware | undefined) => void;
  addFormatter: (formatter: FormatterMiddleware | undefined) => void;
  setObserver: (observer: ObserverMiddleware | undefined) => void;
  hasObserver: () => boolean;
  setUi: (ui: UiLibMiddleware | undefined) => void;
  hasUi: () => boolean;
  addBackend: (backend: BackendMiddleware | undefined) => void;
  setDevBackend: (backend: BackendMiddleware | undefined) => void;
  setLanguageDetector: (
    languageDetector: LanguageDetectorMiddleware | undefined
  ) => void;
  setLanguageStorage: (
    languageStorage: LanguageStorageMiddleware | undefined
  ) => void;
  onPrepare: (callback: () => void) => void;
}>;

export type TolgeePlugin = (
  tolgee: TolgeeInstance,
  tools: PluginTools
) => TolgeeInstance;
