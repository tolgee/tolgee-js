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
  isDev: boolean;
  data: TranslationsFlat;
};

type StateCache = Map<string, CacheRecord>;

export const Cache = (
  onCacheChange: EventEmitterType<CacheDescriptorWithKey>,
  getStaticData: () => Options['staticData'],
  backendGetRecord: BackendGetRecord,
  backendGetDevRecord: BackendGetDevRecord,
  isDev: () => boolean,
  withDefaultNs: (descriptor: CacheDescriptor) => CacheDescriptorInternal,
  isInitialLoading: () => boolean,
  fetchingObserver: ValueObserverInstance<boolean>,
  loadingObserver: ValueObserverInstance<boolean>
) => {
  const asyncRequests: CacheAsyncRequests = new Map();
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
    let dataPromise = undefined as Promise<TreeTranslationsData> | undefined;
    if (!dataPromise) {
      const staticDataValue = getStaticData()?.[encodeCacheKey(keyObject)];
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

  function fetchData(keyObject: CacheDescriptorInternal) {
    let dataPromise = undefined as Promise<TreeTranslationsData> | undefined;
    if (isDev()) {
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

  async function loadRecords(descriptors: CacheDescriptor[]) {
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
      const dataPromise = fetchData(keyObject);
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
          addRecord(value.keyObject, data, isDev());
        }
      }
    });
    fetchingObserver.notify();
    loadingObserver.notify();

    return withPromises.map((val) => getRecord(val.keyObject)!);
  }

  async function loadRecord(descriptor: CacheDescriptor) {
    const result = await loadRecords([descriptor]);
    return result[0];
  }

  return Object.freeze({
    init,
    addRecord,
    exists,
    getRecord,
    getTranslation,
    getTranslationNs,
    getTranslationFallback,
    changeTranslation,
    isFetching,
    isLoading,
    loadRecord,
    loadRecords,
    clear,
  });
};

export type CacheType = ReturnType<typeof Cache>;
