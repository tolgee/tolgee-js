export type FallbackGeneral = undefined | false | string | string[];

export type NsType = string;

export type KeyType = string;

export type NsFallback = undefined | NsType | NsType[];

export type FallbackLanguageObject = Record<string, FallbackGeneral>;

export type FallbackLanguageOption = FallbackGeneral | FallbackLanguageObject;

export type DefaultParamType = string | number | bigint;

export type TranslateParams<T = DefaultParamType> = {
  [key: string]: T;
};

export type TranslateOptions = {
  ns?: NsType | null;
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

type PropType<TObj> = TObj[keyof TObj];

export type CombinedOptions<T> = TranslateOptions & {
  [key: string]: T | PropType<TranslateOptions>;
};

export type TFnType<T = DefaultParamType, R = string> = {
  (key: string, defaultValue?: string, options?: CombinedOptions<T>): R;
  (key: string, options?: CombinedOptions<T>): R;
  (props: TranslateProps<T>): R;
};

export type KeyAndNamespacesInternal = Pick<
  TranslatePropsInternal,
  'key' | 'ns'
>;
