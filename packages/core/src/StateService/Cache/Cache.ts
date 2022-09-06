import {
  CacheKeyObject,
  Options,
  TranslationsFlat,
  TreeTranslationsData,
} from '../../types';

import { decodeCacheKey, encodeCacheKey, flattenTranslations } from './helpers';

type CacheRecordOrigin = 'initial' | 'prod' | 'dev';

type CacheRecord = {
  origin: CacheRecordOrigin;
  data: TranslationsFlat;
};

type StateCache = Map<string, CacheRecord>;

export const Cache = () => {
  const cache: StateCache = new Map();
  const init = (data: Options['staticData']) => {
    if (data) {
      Object.entries(data).forEach(([key, value]) => {
        if (typeof value !== 'function') {
          addRecord(decodeCacheKey(key), 'initial', value);
        }
      });
    }
  };

  const addRecord = (
    descriptor: CacheKeyObject,
    origin: CacheRecordOrigin,
    data: TreeTranslationsData
  ) => {
    cache.set(encodeCacheKey(descriptor), {
      data: flattenTranslations(data),
      origin,
    });
  };

  const exists = (descriptor: CacheKeyObject, origin?: CacheRecordOrigin) => {
    const record = cache.get(encodeCacheKey(descriptor));
    if (origin && record) {
      return origin === record.origin;
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
