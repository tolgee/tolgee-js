import {
  CacheKeyObject,
  CacheRecordOrigin,
  Options,
  StateCache,
  TreeTranslationsData,
} from '../../types';

import { decodeCacheKey, encodeCacheKey, flattenTranslations } from './helpers';

export const cacheInit = (data: Options['staticData']) => {
  const cache: StateCache = {
    translations: new Map(),
    asyncRequests: new Map(),
  };

  if (data) {
    Object.entries(data).forEach(([key, value]) => {
      if (typeof value !== 'function') {
        cacheAddRecord(cache, decodeCacheKey(key), 'initial', value);
      }
    });
  }
  return cache;
};

export const cacheAddRecord = (
  cache: StateCache,
  descriptor: CacheKeyObject,
  origin: CacheRecordOrigin,
  data: TreeTranslationsData
) => {
  cache.translations.set(encodeCacheKey(descriptor), {
    data: flattenTranslations(data),
    origin,
  });
};

export const cacheAddRecordAsync = async (
  cache: StateCache,
  descriptor: CacheKeyObject,
  origin: CacheRecordOrigin,
  dataPromise: Promise<TreeTranslationsData>
) => {
  const cacheKey = encodeCacheKey(descriptor);
  cache.asyncRequests.set(cacheKey, dataPromise);
  const data = await dataPromise;
  cache.asyncRequests.set(cacheKey, undefined);
  cache.translations.set(encodeCacheKey(descriptor), {
    data: flattenTranslations(data),
    origin,
  });
};

export const cacheIsLoading = async (
  cache: StateCache,
  descriptor: CacheKeyObject
) => {
  return Boolean(cache.asyncRequests.get(encodeCacheKey(descriptor)));
};

export const cacheGetRecord = (
  cache: StateCache,
  descriptor: CacheKeyObject
) => {
  return cache.translations.get(encodeCacheKey(descriptor))?.data;
};

export const cacheGetTranslation = (
  cache: StateCache,
  descriptor: CacheKeyObject,
  key: string
) => {
  return cache.translations.get(encodeCacheKey(descriptor))?.data.get(key);
};

export const cacheChangeTranslation = (
  cache: StateCache,
  descriptor: CacheKeyObject,
  key: string,
  value: string
) => {
  const record = cache.translations.get(encodeCacheKey(descriptor))?.data;
  record?.set(key, value);
};
