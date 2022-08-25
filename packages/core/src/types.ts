export type { State } from './StateService/initState';
export type { Options } from './StateService/initState';

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
