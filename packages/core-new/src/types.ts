export type Subscription = () => { unsubscribe: () => void };

export enum ModifierKey {
  Alt,
  Control,
  Shift,
  Meta,
}

export type Translations = Record<string, string | null>;

export type TreeTranslationsData = {
  [key: string]: string | TreeTranslationsData;
};

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

export type TolgeeState = {
  running: boolean;
  scopes?: Scope[];
  projectId?: number;
  permittedLanguageIds?: number[];
  mode?: Mode;
  language: string;
  languageFuture: string;
};

export type Scope =
  | 'translations.edit'
  | 'translations.view'
  | 'keys.edit'
  | 'screenshots.upload'
  | 'screenshots.view'
  | 'screenshots.delete';

export type Mode = 'development' | 'production';

/**
 * Tolgee methods
 */
export type TolgeeTranslate = {
  (props: TranslateProps): Promise<string>;
  <T>(props: TranslatePropsTags<T>): Promise<TranslationTags<T>>;

  (
    key: string,
    params?: TranslationParams,
    noWrap?: boolean,
    defaultValue?: string
  ): Promise<string>;
  <T>(
    key: string,
    params?: TranslationParamsTags<T>,
    noWrap?: boolean,
    defaultValue?: string
  ): Promise<TranslationTags<T>>;
};

export type TolgeeWrap = {
  (
    key: string,
    params?: TranslationParams,
    defaultValue?: string | undefined,
    translation?: string
  ): string;
  <T>(
    key: string,
    params?: TranslationTags<T>,
    defaultValue?: string | undefined,
    translation?: TranslationTags<T>
  ): TranslationTags<T>;
};

export type TolgeeInstant = {
  (
    key: string,
    params?: TranslationParams,
    noWrap?: boolean,
    orEmpty?: boolean,
    defaultValue?: string
  ): string;
  <T>(
    key: string,
    params?: TranslationParamsTags<T>,
    noWrap?: boolean,
    orEmpty?: boolean,
    defaultValue?: string
  ): TranslationTags<T>;

  (props: InstantProps): string;
  <T>(props: InstantPropsTags<T>): TranslationTags<T>;
};

/**
 * Ui module
 */

type UiConstructor = new (...args: any[]) => any;

interface UiLibInterface {
  UI: UiConstructor;
}

export type UiType =
  | UiConstructor
  | UiLibInterface
  | Promise<UiConstructor>
  | Promise<UiLibInterface>;

/**
 * modules
 */

export type FormatFunction = (props: {
  translation: string;
  params: Record<string, any>;
  language: string;
}) => string | any[];

export interface Formatter {
  format: FormatFunction;
}

export type FormatterStatic = {
  type: 'formatter';
  (): Formatter;
};

export type TolgeeModule = FormatterStatic;
