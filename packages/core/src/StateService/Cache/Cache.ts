import {
  CacheKeyObject,
  Options,
  TranslationsFlat,
  TreeTranslationsData,
} from '../../types';

import { decodeCacheKey, encodeCacheKey, flattenTranslations } from './helpers';

type CacheRecord = {
  isDev: boolean;
  data: TranslationsFlat;
};

type StateCache = Map<string, CacheRecord>;

export const Cache = () => {
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
    descriptor: CacheKeyObject,
    data: TreeTranslationsData,
    isDev: boolean
  ) => {
    cache.set(encodeCacheKey(descriptor), {
      data: flattenTranslations(data),
      isDev,
    });
  };

  const exists = (descriptor: CacheKeyObject, isDev?: boolean) => {
    const record = cache.get(encodeCacheKey(descriptor));
    if (isDev && record) {
      return record.isDev;
    }
    return Boolean(record);
  };

  const getRecord = (descriptor: CacheKeyObject) => {
    return cache.get(encodeCacheKey(descriptor))?.data;
  };

  const getTranslation = (descriptor: CacheKeyObject, key: string) => {
    return cache.get(encodeCacheKey(descriptor))?.data.get(key);
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
    descriptor: CacheKeyObject,
    key: string,
    value: string
  ) => {
    const record = cache.get(encodeCacheKey(descriptor))?.data;
    record?.set(key, value);
  };

  return Object.freeze({
    init,
    addRecord,
    exists,
    getRecord,
    getTranslation,
    getTranslationFallback,
    changeTranslation,
  });
};

export type CacheType = ReturnType<typeof Cache>;
