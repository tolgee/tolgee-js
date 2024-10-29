import {
  CacheDescriptor,
  CacheDescriptorInternal,
  NsFallback,
  TranslationsFlat,
  TranslationValue,
  TreeTranslationsData,
  BackendGetRecordInternal,
  RecordFetchError,
} from '../../types';
import { getFallbackArray, isPromise, unique } from '../../helpers';
import { TolgeeStaticData } from '../State/initState';
import { ValueObserverInstance } from '../ValueObserver';

import { decodeCacheKey, encodeCacheKey, flattenTranslations } from './helpers';
import { EventsInstance } from '../Events/Events';

type CacheAsyncRequests = Map<
  string,
  Promise<TreeTranslationsData | undefined> | undefined
>;

type CacheRecord = {
  version: number;
  data: TranslationsFlat;
};

type StateCache = Map<string, CacheRecord>;

export function Cache(
  events: EventsInstance,
  backendGetRecord: BackendGetRecordInternal,
  backendGetDevRecord: BackendGetRecordInternal,
  withDefaultNs: (descriptor: CacheDescriptor) => CacheDescriptorInternal,
  isInitialLoading: () => boolean,
  fetchingObserver: ValueObserverInstance<boolean>,
  loadingObserver: ValueObserverInstance<boolean>
) {
  const asyncRequests: CacheAsyncRequests = new Map();
  const cache: StateCache = new Map();
  let staticData: NonNullable<TolgeeStaticData> = {};
  let version = 0;

  function addRecordInternal(
    descriptor: CacheDescriptorInternal,
    data: TreeTranslationsData,
    recordVersion: number
  ) {
    const cacheKey = encodeCacheKey(descriptor);
    cache.set(cacheKey, {
      data: flattenTranslations(data),
      version: recordVersion,
    });
    events.onCacheChange.emit(descriptor);
  }

  /**
   * Fetches production data
   */
  async function fetchProd(keyObject: CacheDescriptorInternal) {
    function handleError(e: any) {
      const error = new RecordFetchError(keyObject, e);
      events.onError.emit(error);
      // eslint-disable-next-line no-console
      console.error(error);
      throw error;
    }

    const dataFromBackend = backendGetRecord(keyObject);
    if (isPromise(dataFromBackend)) {
      const result = await dataFromBackend.catch(handleError);
      if (result !== undefined) {
        return result;
      }
    }

    const staticDataValue = staticData[encodeCacheKey(keyObject)];
    if (typeof staticDataValue === 'function') {
      try {
        return await staticDataValue();
      } catch (e) {
        handleError(e);
      }
    } else {
      return staticDataValue;
    }
  }

  async function fetchData(keyObject: CacheDescriptorInternal, isDev: boolean) {
    let result = undefined as TreeTranslationsData | undefined;

    if (isDev) {
      try {
        result = await backendGetDevRecord(keyObject);
      } catch (e) {
        const error = new RecordFetchError(keyObject, e, true);
        events.onError.emit(error);
        // eslint-disable-next-line no-console
        console.warn(error);
      }
    }

    if (!result) {
      result = await fetchProd(keyObject);
    }

    return result;
  }

  const self = Object.freeze({
    addStaticData(data: TolgeeStaticData | undefined) {
      if (data) {
        staticData = { ...staticData, ...data };
        Object.entries(data).forEach(([key, value]) => {
          if (typeof value !== 'function') {
            const descriptor = decodeCacheKey(key);
            const existing = cache.get(key);
            if (!existing || existing.version === 0) {
              addRecordInternal(descriptor, value, 0);
            }
          }
        });
      }
    },

    invalidate() {
      asyncRequests.clear();
      version += 1;
    },

    addRecord(descriptor: CacheDescriptorInternal, data: TreeTranslationsData) {
      addRecordInternal(descriptor, data, version);
    },

    exists(descriptor: CacheDescriptorInternal, strict = false) {
      const record = cache.get(encodeCacheKey(descriptor));
      if (record && strict) {
        return record.version === version;
      }
      return Boolean(record);
    },

    getRecord(descriptor: CacheDescriptor) {
      return cache.get(encodeCacheKey(withDefaultNs(descriptor)))?.data;
    },

    getTranslation(descriptor: CacheDescriptorInternal, key: string) {
      return cache.get(encodeCacheKey(descriptor))?.data.get(key);
    },

    getTranslationNs(namespaces: string[], languages: string[], key: string) {
      for (const namespace of namespaces) {
        for (const language of languages) {
          const value = cache
            .get(encodeCacheKey({ language, namespace }))
            ?.data.get(key);
          if (value !== undefined && value !== null) {
            return [namespace];
          }
        }
      }
      return unique(namespaces);
    },

    getTranslationFallback(
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
    },

    changeTranslation(
      descriptor: CacheDescriptorInternal,
      key: string,
      value: TranslationValue
    ) {
      const record = cache.get(encodeCacheKey(descriptor))?.data;
      record?.set(key, value);
      events.onCacheChange.emit({ ...descriptor, key });
    },

    isFetching(ns?: NsFallback) {
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
    },

    isLoading(language: string | undefined, ns?: NsFallback) {
      const namespaces = getFallbackArray(ns);

      return Boolean(
        isInitialLoading() ||
          Array.from(asyncRequests.keys()).find((key) => {
            const descriptor = decodeCacheKey(key);
            return (
              (!namespaces.length ||
                namespaces.includes(descriptor.namespace)) &&
              !self.exists({
                namespace: descriptor.namespace,
                language: language!,
              })
            );
          })
      );
    },

    async loadRecords(descriptors: CacheDescriptor[], isDev: boolean) {
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
        const dataPromise =
          fetchData(keyObject, isDev) || Promise.resolve(undefined);
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
        const promiseChanged =
          asyncRequests.get(value.cacheKey) !== value.promise;
        // if promise has changed in between, it means cache been invalidated or
        // new data are being fetched
        if (value.new && !promiseChanged) {
          asyncRequests.delete(value.cacheKey);
          const data = results[i];
          if (data) {
            self.addRecord(value.keyObject, data);
          } else if (!self.getRecord(value.keyObject)) {
            // if no data exist, put empty object
            self.addRecord(value.keyObject, {});
          }
        }
      });
      fetchingObserver.notify();
      loadingObserver.notify();

      return withPromises.map((val) => self.getRecord(val.keyObject)!);
    },

    getAllRecords() {
      const entries = Array.from(cache.entries());
      return entries.map(([key, entry]) => {
        return {
          ...decodeCacheKey(key),
          data: entry.data,
        };
      });
    },
  });

  return self;
}

export type CacheInstance = ReturnType<typeof Cache>;
