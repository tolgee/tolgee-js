export type TranslationValue = string | undefined | null;

export type TranslationsFlat = Record<string, TranslationValue>;

export type TreeTranslationsData = {
  [key: string]: TranslationValue | TreeTranslationsData;
};

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

export type TranslationChanger = {
  revert: () => void;
};

export type ChangeTranslationInterface = (
  descriptor: CacheDescriptor,
  key: string,
  value: string
) => TranslationChanger;

export type CachePublicRecord = {
  data: TranslationsFlat;
  language: string;
  namespace: string;
};

export type CacheInternalRecord = {
  data: TranslationsFlat;
  language: string;
  namespace: string;
  cacheKey: string;
};

export type LoadOptions = {
  noDev?: boolean;
  useCache?: boolean;
};

export type LoadRequiredOptions = LoadOptions & {
  language?: string;
};

export type MatrixOptions = {
  languages: string[] | 'all';
  namespaces: string[] | 'all';
};

export type LoadMatrixOptions = LoadOptions & MatrixOptions;
