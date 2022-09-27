import {
  CacheAsyncRequests,
  CacheDescriptor,
  CacheDescriptorInternal,
  CacheDescriptorWithKey,
  EventEmitterType,
  FallbackNSTranslation,
  Options,
  TranslationsFlat,
  TranslationValue,
  TreeTranslationsData,
  BackendGetRecord,
  BackendGetDevRecord,
} from '../../types';
import { getFallbackArray } from '../State/helpers';
import { ValueObserverInstance } from '../ValueObserver';

import { decodeCacheKey, encodeCacheKey, flattenTranslations } from './helpers';

type CacheRecord = {
  version: number;
  data: TranslationsFlat;
};

type StateCache = Map<string, CacheRecord>;

export const Cache = (
  onCacheChange: EventEmitterType<CacheDescriptorWithKey>,
  backendGetRecord: BackendGetRecord,
  backendGetDevRecord: BackendGetDevRecord,
  withDefaultNs: (descriptor: CacheDescriptor) => CacheDescriptorInternal,
  isInitialLoading: () => boolean,
  fetchingObserver: ValueObserverInstance<boolean>,
  loadingObserver: ValueObserverInstance<boolean>
) => {
  const asyncRequests: CacheAsyncRequests = new Map();
  const cache: StateCache = new Map();
  let staticData: NonNullable<Options['staticData']> = {};
  let version = 0;

  function init(data: Options['staticData']) {
    if (data) {
      staticData = { ...staticData, ...data };
      Object.entries(data).forEach(([key, value]) => {
        if (typeof value !== 'function') {
          addRecord(decodeCacheKey(key), value);
        }
      });
    }
  }

  function invalidate() {
    version += 1;
  }

  function addRecord(
    descriptor: CacheDescriptorInternal,
    data: TreeTranslationsData
  ) {
    const cacheKey = encodeCacheKey(descriptor);
    staticData[cacheKey] = data;
    cache.set(cacheKey, {
      data: flattenTranslations(data),
      version: version,
    });
    onCacheChange.emit(descriptor);
  }

  function exists(descriptor: CacheDescriptorInternal, strict = false) {
    const record = cache.get(encodeCacheKey(descriptor));
    if (record && strict) {
      return record.version === version;
    }
    return Boolean(record);
  }

  function getRecord(descriptor: CacheDescriptorInternal) {
    return cache.get(encodeCacheKey(descriptor))?.data;
  }

  function getTranslation(descriptor: CacheDescriptorInternal, key: string) {
    return cache.get(encodeCacheKey(descriptor))?.data.get(key);
  }

  function getTranslationNs(
    namespaces: string[],
    languages: string[],
    key: string
  ) {
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
  }

  function getTranslationFallback(
    namespaces: string[],
    languages: string[],
    key: string
  ) {
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
  }

  function changeTranslation(
    descriptor: CacheDescriptorInternal,
    key: string,
    value: TranslationValue
  ) {
    const record = cache.get(encodeCacheKey(descriptor))?.data;
    record?.set(key, value);
    onCacheChange.emit({ ...descriptor, key });
  }

  function clear() {
    cache.clear();
  }

  function isFetching(ns?: FallbackNSTranslation) {
    if (isInitialLoading()) {
      return true;
    }

    if (ns === undefined) {
      return asyncRequests.size > 0;
    }
    const namespaces = getFallbackArray(ns);
    return Boolean(
      Array.from(asyncRequests.keys()).find((key) =>
        namespaces.includes(decodeCacheKey(key).namespace)
      )
    );
  }

  function isLoading(language: string | undefined, ns?: FallbackNSTranslation) {
    const namespaces = getFallbackArray(ns);

    return Boolean(
      isInitialLoading() ||
        Array.from(asyncRequests.keys()).find((key) => {
          const descriptor = decodeCacheKey(key);
          return (
            (!namespaces.length || namespaces.includes(descriptor.namespace)) &&
            !exists({
              namespace: descriptor.namespace,
              language: language!,
            })
          );
        })
    );
  }

  function fetchNormal(keyObject: CacheDescriptorInternal) {
    let dataPromise = undefined as
      | Promise<TreeTranslationsData | undefined>
      | undefined;
    if (!dataPromise) {
      const staticDataValue = staticData[encodeCacheKey(keyObject)];
      if (typeof staticDataValue === 'function') {
        dataPromise = staticDataValue();
      } else if (staticDataValue) {
        dataPromise = Promise.resolve(staticDataValue);
      }
    }

    if (!dataPromise) {
      dataPromise = backendGetRecord(keyObject);
    }

    if (!dataPromise) {
      // return empty data, so we know it has already been attempted to fetch
      dataPromise = Promise.resolve({});
    }
    return dataPromise;
  }

  function fetchData(keyObject: CacheDescriptorInternal, isDev: boolean) {
    let dataPromise = undefined as
      | Promise<TreeTranslationsData | undefined>
      | undefined;
    if (isDev) {
      dataPromise = backendGetDevRecord(keyObject)?.catch(() => {
        // eslint-disable-next-line no-console
        console.warn(`Tolgee: Failed to fetch data from dev backend`);
        // fallback to normal fetch if dev fails
        return fetchNormal(keyObject);
      });
    }

    if (!dataPromise) {
      dataPromise = fetchNormal(keyObject);
    }

    return dataPromise;
  }

  async function loadRecords(descriptors: CacheDescriptor[], isDev: boolean) {
    const withPromises = descriptors.map((descriptor) => {
      const keyObject = withDefaultNs(descriptor);
      const cacheKey = encodeCacheKey(keyObject);
      const existingPromise = asyncRequests.get(cacheKey);

      if (existingPromise) {
        return {
          new: false,
          promise: existingPromise,
          keyObject,
          cacheKey,
        };
      }
      const dataPromise = fetchData(keyObject, isDev);
      asyncRequests.set(cacheKey, dataPromise);
      return {
        new: true,
        promise: dataPromise,
        keyObject,
        cacheKey,
      };
    });
    fetchingObserver.notify();
    loadingObserver.notify();

    const results = await Promise.all(withPromises.map((val) => val.promise));

    withPromises.forEach((value, i) => {
      if (value.new) {
        asyncRequests.delete(value.cacheKey);
        const data = results[i];
        if (data) {
          addRecord(value.keyObject, data);
        }
      }
    });
    fetchingObserver.notify();
    loadingObserver.notify();

    return withPromises.map((val) => getRecord(val.keyObject)!);
  }

  function getAllRecords() {
    const entries = Array.from(cache.entries());
    return entries.map(([key, entry]) => {
      return {
        ...decodeCacheKey(key),
        data: entry.data,
      };
    });
  }

  return Object.freeze({
    init,
    invalidate,
    addRecord,
    exists,
    getRecord,
    getTranslation,
    getTranslationNs,
    getTranslationFallback,
    changeTranslation,
    isFetching,
    isLoading,
    loadRecords,
    clear,
    getAllRecords,
  });
};

export type CacheType = ReturnType<typeof Cache>;
