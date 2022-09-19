import {
  CacheDescriptorInternal,
  CacheDescriptorWithKey,
  EventEmitterType,
  Options,
  TranslationsFlat,
  TranslationValue,
  TreeTranslationsData,
} from '../../types';

import { decodeCacheKey, encodeCacheKey, flattenTranslations } from './helpers';

type CacheRecord = {
  isDev: boolean;
  data: TranslationsFlat;
};

type StateCache = Map<string, CacheRecord>;

type Props = {
  onCacheChange: EventEmitterType<CacheDescriptorWithKey>;
};

export const Cache = ({ onCacheChange }: Props) => {
  const cache: StateCache = new Map();
  const init = (data: Options['staticData']) => {
    if (data) {
      Object.entries(data).forEach(([key, value]) => {
        if (typeof value !== 'function') {
          addRecord(decodeCacheKey(key), value, false);
        }
      });
    }
  };

  const addRecord = (
    descriptor: CacheDescriptorInternal,
    data: TreeTranslationsData,
    isDev: boolean
  ) => {
    cache.set(encodeCacheKey(descriptor), {
      data: flattenTranslations(data),
      isDev,
    });
    onCacheChange.emit(descriptor);
  };

  const exists = (descriptor: CacheDescriptorInternal, isDev?: boolean) => {
    const record = cache.get(encodeCacheKey(descriptor));
    if (isDev && record) {
      return record.isDev;
    }
    return Boolean(record);
  };

  const getRecord = (descriptor: CacheDescriptorInternal) => {
    return cache.get(encodeCacheKey(descriptor))?.data;
  };

  const getTranslation = (descriptor: CacheDescriptorInternal, key: string) => {
    return cache.get(encodeCacheKey(descriptor))?.data.get(key);
  };

  const getTranslationNs = (
    namespaces: string[],
    languages: string[],
    key: string
  ) => {
    for (const namespace of namespaces) {
      for (const language of languages) {
        const value = cache
          .get(encodeCacheKey({ language, namespace }))
          ?.data.get(key);
        if (value !== undefined && value !== null) {
          return namespace;
        }
      }
    }
    return Array.from(new Set(namespaces));
  };

  const getTranslationFallback = (
    namespaces: string[],
    languages: string[],
    key: string
  ) => {
    for (const namespace of namespaces) {
      for (const language of languages) {
        const value = cache
          .get(encodeCacheKey({ language, namespace }))
          ?.data.get(key);
        if (value !== undefined && value !== null) {
          return value;
        }
      }
    }
    return undefined;
  };

  const changeTranslation = (
    descriptor: CacheDescriptorInternal,
    key: string,
    value: TranslationValue
  ) => {
    const record = cache.get(encodeCacheKey(descriptor))?.data;
    record?.set(key, value);
    onCacheChange.emit({ ...descriptor, key });
  };

  const clear = () => {
    cache.clear();
  };

  return Object.freeze({
    init,
    addRecord,
    exists,
    getRecord,
    getTranslation,
    getTranslationNs,
    getTranslationFallback,
    changeTranslation,
    clear,
  });
};

export type CacheType = ReturnType<typeof Cache>;
