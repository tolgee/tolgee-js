export type FallbackGeneral = undefined | false | string | string[];

export type NsType = string;

/**
 * Augment this interface to narrow `TranslationKey` to your own keys:
 *
 * ```ts
 * declare module '@tolgee/core' {
 *   interface TranslationKeyConfig {
 *     key: 'hello' | 'world';
 *   }
 * }
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface TranslationKeyConfig {}

// `string & Record<never, never>` prevents typescript to optimize this to 'string'
export type TranslationKey = TranslationKeyConfig extends { key: infer K }
  ? K
  : string & Record<never, never>;

export type NsFallback = undefined | NsType | NsType[];

export type FallbackLanguageObject = Record<string, FallbackGeneral>;

export type FallbackLanguageOption = FallbackGeneral | FallbackLanguageObject;

export type DefaultParamType = string | number | bigint | Date;

export type TranslateParams<T = DefaultParamType> = {
  [key: string]: T;
};

export type TranslateOptions = {
  ns?: NsType | null;
  noWrap?: boolean;
  orEmpty?: boolean;
  language?: string;
};

export type TranslateProps<
  T = DefaultParamType,
  K extends string = TranslationKey,
> = {
  key: K;
  defaultValue?: string;
  params?: TranslateParams<T>;
} & TranslateOptions;

export type TranslatePropsInternal = TranslateProps & {
  translation?: string;
};

type PropType<TObj> = TObj[keyof TObj];

export type CombinedOptions<T> = TranslateOptions & {
  [key: string]: T | PropType<TranslateOptions>;
};

export type TFnType<
  T = DefaultParamType,
  R = string,
  K extends string = TranslationKey,
> = {
  (key: K, defaultValue?: string, options?: CombinedOptions<T>): R;
  (key: K, options?: CombinedOptions<T>): R;
  (props: TranslateProps<T, K>): R;
};

export type KeyAndNamespacesInternal = Pick<
  TranslatePropsInternal,
  'key' | 'ns' | 'language'
>;

export type FetchFn = (
  input: string | URL,
  init?: RequestInit | undefined
) => Promise<Response>;
