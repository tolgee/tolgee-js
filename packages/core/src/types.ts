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

export type CacheTranslations = Map<string, CacheRecord>;
export type CacheAsyncRequests = Map<
  string,
  Promise<TreeTranslationsData> | undefined
>;

export type StateCache = {
  translations: CacheTranslations;
  asyncRequests: CacheAsyncRequests;
};

export type CacheDescriptor = {
  language: string;
  namespace?: string;
};

export type CacheKeyObject = {
  language: string;
  namespace: string;
};
