import {
  CacheDescriptor,
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
  descriptor: CacheDescriptor,
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
  descriptor: CacheDescriptor,
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
  descriptor: CacheDescriptor
) => {
  return Boolean(cache.asyncRequests.get(encodeCacheKey(descriptor)));
};

export const cacheGetRecord = (
  cache: StateCache,
  descriptor: CacheDescriptor
) => {
  return cache.translations.get(encodeCacheKey(descriptor))?.data;
};

export const cacheGetTranslation = (
  cache: StateCache,
  descriptor: CacheDescriptor,
  key: string
) => {
  return cache.translations.get(encodeCacheKey(descriptor))?.data.get(key);
};

export const cacheChangeTranslation = (
  cache: StateCache,
  descriptor: CacheDescriptor,
  key: string,
  value: string
) => {
  const record = cache.translations.get(encodeCacheKey(descriptor))?.data;
  record?.set(key, value);
};
