import {
  CacheDescriptor,
  CacheDescriptorInternal,
  NsFallback,
  TranslationValue,
  TreeTranslationsData,
  BackendGetRecordInternal,
  RecordFetchError,
  LoadOptions,
  CacheInternalRecord,
  TranslationsFlat,
} from '../../types';
import { getFallbackArray, isPromise, unique } from '../../helpers';
import { TolgeeStaticData, TolgeeStaticDataProp } from '../State/initState';
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
    data: TranslationsFlat,
    recordVersion: number
  ) {
    const cacheKey = encodeCacheKey(descriptor);
    cache.set(cacheKey, {
      data: flattenTranslations(data),
      version: recordVersion,
    });
    events.onCacheChange.emit(decodeCacheKey(cacheKey));
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
    addStaticData(data: TolgeeStaticDataProp | undefined) {
      if (Array.isArray(data)) {
        for (const record of data) {
          const key = encodeCacheKey(record);
          const existing = cache.get(key);
          if (!existing || existing.version === 0) {
            addRecordInternal(record, flattenTranslations(record.data), 0);
          }
        }
      } else if (data) {
        staticData = { ...staticData, ...data };
        Object.entries(data).forEach(([key, value]) => {
          if (typeof value !== 'function') {
            const descriptor = decodeCacheKey(key);
            const existing = cache.get(key);
            if (!existing || existing.version === 0) {
              addRecordInternal(descriptor, flattenTranslations(value), 0);
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
      addRecordInternal(descriptor, flattenTranslations(data), version);
    },

    exists(descriptor: CacheDescriptorInternal, strict = false) {
      const record = cache.get(encodeCacheKey(descriptor));
      if (record && strict) {
        return record.version === version;
      }
      return Boolean(record);
    },

    getRecord(descriptor: CacheDescriptor): CacheInternalRecord | undefined {
      const descriptorWithNs = withDefaultNs(descriptor);
      const cacheKey = encodeCacheKey(descriptorWithNs);
      const cacheRecord = cache.get(cacheKey);
      if (!cacheRecord) {
        return undefined;
      }
      return {
        ...descriptorWithNs,
        cacheKey,
        data: cacheRecord.data,
      };
    },

    getAllRecords() {
      const entries = Array.from(cache.entries());
      return entries.map(([key]) => self.getRecord(decodeCacheKey(key)));
    },

    getTranslation(descriptor: CacheDescriptorInternal, key: string) {
      return cache.get(encodeCacheKey(descriptor))?.data[key];
    },

    getTranslationNs(namespaces: string[], languages: string[], key: string) {
      for (const namespace of namespaces) {
        for (const language of languages) {
          const value = cache.get(encodeCacheKey({ language, namespace }))
            ?.data[key];
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
          const value = cache.get(encodeCacheKey({ language, namespace }))
            ?.data[key];
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
      if (record?.[key]) {
        record[key] = value;
        events.onCacheChange.emit({ ...descriptor, key });
      }
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

    isLoading(language: string, ns?: NsFallback) {
      const namespaces = getFallbackArray(ns);

      if (isInitialLoading()) {
        return true;
      }

      const pendingCacheKeys = Array.from(asyncRequests.keys());

      return Boolean(
        pendingCacheKeys.find((key) => {
          const descriptor = decodeCacheKey(key);
          return (
            (!namespaces.length || namespaces.includes(descriptor.namespace)) &&
            !self.exists({
              namespace: descriptor.namespace,
              language: language,
            })
          );
        })
      );
    },

    async loadRecords(
      descriptors: CacheDescriptor[],
      options?: LoadOptions
    ): Promise<CacheInternalRecord[]> {
      type WithPromise = {
        new: boolean;
        language: string;
        namespace: string;
        cacheKey: string;
        promise?: Promise<TreeTranslationsData | undefined>;
        data?: TranslationsFlat;
      };

      const withPromises: WithPromise[] = descriptors.map((descriptor) => {
        const keyObject = withDefaultNs(descriptor);
        const cacheKey = encodeCacheKey(keyObject);
        if (options?.useCache) {
          const exists = self.exists(keyObject, true);

          if (exists) {
            return {
              ...keyObject,
              new: false,
              cacheKey,
              data: self.getRecord(keyObject)!.data,
            } as WithPromise;
          }
        }

        const existingPromise = asyncRequests.get(cacheKey);

        if (existingPromise) {
          return {
            ...keyObject,
            new: false,
            promise: existingPromise,
            cacheKey,
          };
        }

        const dataPromise =
          fetchData(keyObject, !options?.noDev) || Promise.resolve(undefined);

        asyncRequests.set(cacheKey, dataPromise);

        return {
          ...keyObject,
          new: true,
          promise: dataPromise,
          cacheKey,
        };
      });
      fetchingObserver.notify();
      loadingObserver.notify();

      const promisesToWait = withPromises
        .map((val) => val.promise)
        .filter(Boolean);

      const fetchedData = await Promise.all(promisesToWait);

      withPromises.forEach((value) => {
        if (value.promise) {
          value.data = flattenTranslations(fetchedData[0] ?? {});
          fetchedData.shift();
        }
        // if promise has changed in between, it means cache been invalidated or
        // new data are being fetched
        const promiseChanged =
          asyncRequests.get(value.cacheKey) !== value.promise;
        if (value.new && !promiseChanged) {
          asyncRequests.delete(value.cacheKey);
          if (value.data) {
            self.addRecord(value, value.data);
          } else if (!self.getRecord(value)) {
            // if no data exist, put empty object
            // so we know we don't have to fetch again
            self.addRecord(value, {});
          }
        }
      });
      fetchingObserver.notify();
      loadingObserver.notify();

      return withPromises.map((val) => ({
        language: val.language,
        namespace: val.namespace,
        data: val.data ?? {},
        cacheKey: val.cacheKey,
      }));
    },
  });

  return self;
}

export type CacheInstance = ReturnType<typeof Cache>;
