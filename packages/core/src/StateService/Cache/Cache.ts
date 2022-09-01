import {
  CacheKeyObject,
  CacheRecordOrigin,
  Options,
  StateCache,
  TreeTranslationsData,
} from '../../types';

import { decodeCacheKey, encodeCacheKey, flattenTranslations } from './helpers';

export const cacheInit = (cache: StateCache, data: Options['staticData']) => {
  if (data) {
    Object.entries(data).forEach(([key, value]) => {
      if (typeof value !== 'function') {
        cacheAddRecord(cache, decodeCacheKey(key), 'initial', value);
      }
    });
  }
};

export const cacheAddRecord = (
  cache: StateCache,
  descriptor: CacheKeyObject,
  origin: CacheRecordOrigin,
  data: TreeTranslationsData
) => {
  cache.set(encodeCacheKey(descriptor), {
    data: flattenTranslations(data),
    origin,
  });
};

export const cacheExists = (
  cache: StateCache,
  descriptor: CacheKeyObject,
  origin?: CacheRecordOrigin
) => {
  const record = cache.get(encodeCacheKey(descriptor));
  if (origin && record) {
    return origin === record.origin;
  }
  return Boolean(record);
};

export const cacheGetRecord = (
  cache: StateCache,
  descriptor: CacheKeyObject
) => {
  return cache.get(encodeCacheKey(descriptor))?.data;
};

export const cacheGetTranslation = (
  cache: StateCache,
  descriptor: CacheKeyObject,
  key: string
) => {
  return cache.get(encodeCacheKey(descriptor))?.data.get(key);
};

export const cacheGetTranslationFallback = (
  cache: StateCache,
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

export const cacheChangeTranslation = (
  cache: StateCache,
  descriptor: CacheKeyObject,
  key: string,
  value: string
) => {
  const record = cache.get(encodeCacheKey(descriptor))?.data;
  record?.set(key, value);
};
