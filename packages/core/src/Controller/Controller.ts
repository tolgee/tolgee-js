import type { EventServiceType } from '../Events/Events';
import {
  CacheAsyncRequests,
  CacheDescriptor,
  CacheDescriptorInternal,
  FallbackNSTranslation,
  Options,
  TranslatePropsInternal,
  TreeTranslationsData,
} from '../types';
import { Cache } from './Cache/Cache';
import { decodeCacheKey, encodeCacheKey } from './Cache/helpers';
import { getFallbackArray } from './State/helpers';
import { PluginService } from './Plugins/Plugins';
import { ValueObserver } from './ValueObserver';
import { State } from './State/State';
import { isPromise, missingOptionError, valueOrPromise } from '../helpers';

type StateServiceProps = {
  events: EventServiceType;
  options?: Partial<Options>;
};

export const Controller = ({ events, options }: StateServiceProps) => {
  const state = State(
    events.onLanguageChange,
    events.onPendingLanguageChange,
    events.onRunningChange
  );
  const cache = Cache({
    onCacheChange: events.onCacheChange,
  });
  const asyncRequests: CacheAsyncRequests = new Map();
  const pluginService = PluginService(
    t,
    state.getLanguage,
    state.getInitialOptions,
    state.getApiUrl,
    state.getAvailableLanguages,
    getTranslationNs,
    getTranslation,
    changeTranslation
  );

  state.init(options);
  cache.init(state.getInitialOptions().staticData);
  const fetchingObserver = ValueObserver<boolean>(
    false,
    events.onFetchingChange.emit
  );
  const loadingObserver = ValueObserver<boolean>(
    false,
    events.onLoadingChange.emit
  );

  events.onKeyUpdate.listen(() => {
    if (state.isRunning()) {
      pluginService.retranslate();
    }
  });

  function t(props: TranslatePropsInternal) {
    const translation = getTranslation(props);
    return pluginService.formatTranslation({ ...props, translation });
  }

  function changeTranslation(
    descriptor: CacheDescriptor,
    key: string,
    value: string
  ) {
    const keyObject = withDefaultNs(descriptor);
    const previousValue = cache.getTranslation(keyObject, key);
    cache.changeTranslation(keyObject, key, value);
    return {
      revert: () => {
        cache.changeTranslation(keyObject, key, previousValue);
      },
    };
  }

  function init(options: Partial<Options>) {
    state.init(options);
    cache.clear();
    cache.init(state.getInitialOptions().staticData);
  }

  function isFetching(ns?: FallbackNSTranslation) {
    if (state.isInitialLoading()) {
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

  function isLoading(ns?: FallbackNSTranslation) {
    const namespaces = getFallbackArray(ns);

    return Boolean(
      state.isInitialLoading() ||
        Array.from(asyncRequests.keys()).find((key) => {
          const descriptor = decodeCacheKey(key);
          return (
            (!namespaces.length || namespaces.includes(descriptor.namespace)) &&
            !cache.exists({
              namespace: descriptor.namespace,
              language: state.getLanguage()!,
            })
          );
        })
    );
  }

  function isDev() {
    return Boolean(
      state.getInitialOptions().apiKey && pluginService.getDevBackend()
    );
  }

  function withDefaultNs(descriptor: CacheDescriptor): CacheDescriptorInternal {
    return {
      namespace:
        descriptor.namespace === undefined
          ? state.getInitialOptions().defaultNs
          : descriptor.namespace,
      language: descriptor.language,
    };
  }

  async function addActiveNs(ns: FallbackNSTranslation, forget?: boolean) {
    if (!forget) {
      state.addActiveNs(ns);
    }
    if (state.isRunning()) {
      await loadRequiredRecords(undefined, ns);
    }
  }

  function getRequiredRecords(lang?: string, ns?: FallbackNSTranslation) {
    const languages = state.getFallbackLangs(lang);
    const namespaces =
      ns !== undefined ? getFallbackArray(ns) : state.getRequiredNamespaces();
    const result: CacheDescriptor[] = [];
    languages.forEach((language) => {
      namespaces.forEach((namespace) => {
        if (!cache.exists({ language, namespace }, isDev())) {
          result.push({ language, namespace });
        }
      });
    });
    return result;
  }

  function isLoaded(ns?: FallbackNSTranslation) {
    const language = state.getLanguage();
    if (!language) {
      return false;
    }
    const languages = state.getFallbackLangs(language);
    const namespaces =
      ns !== undefined ? getFallbackArray(ns) : state.getRequiredNamespaces();
    const result: CacheDescriptor[] = [];
    languages.forEach((language) => {
      namespaces.forEach((namespace) => {
        if (!cache.exists({ language, namespace })) {
          result.push({ language, namespace });
        }
      });
    });
    return result.length === 0;
  }

  function loadRequiredRecords(lang?: string, ns?: FallbackNSTranslation) {
    const descriptors = getRequiredRecords(lang, ns);
    if (descriptors.length) {
      return valueOrPromise(loadRecords(descriptors), () => {});
    }
  }

  async function changeLanguage(language: string) {
    if (
      state.getPendingLanguage() === language &&
      state.getLanguage() === language
    ) {
      return;
    }
    state.setPendingLanguage(language);

    if (state.isRunning()) {
      await loadRequiredRecords(language);
    }

    if (language === state.getPendingLanguage()) {
      // there might be parallel language change
      // we only want to apply latest
      state.setLanguage(language);
      pluginService.setStoredLanguage(language);
    }
  }

  function getTranslationNs({
    key,
    ns,
  }: Pick<TranslatePropsInternal, 'key' | 'ns'>) {
    const namespaces = ns
      ? getFallbackArray(ns)
      : state.getFallbackNamespaces();
    const languages = state.getFallbackLangs();
    return cache.getTranslationNs(namespaces, languages, key);
  }

  function getTranslation({
    key,
    ns,
  }: Pick<TranslatePropsInternal, 'key' | 'ns'>) {
    const namespaces = ns
      ? getFallbackArray(ns)
      : state.getFallbackNamespaces();
    const languages = state.getFallbackLangs();
    return cache.getTranslationFallback(namespaces, languages, key);
  }

  function fetchNormal(keyObject: CacheDescriptorInternal) {
    let dataPromise = undefined as Promise<TreeTranslationsData> | undefined;
    if (!dataPromise) {
      const staticDataValue =
        state.getInitialOptions().staticData?.[encodeCacheKey(keyObject)];
      if (typeof staticDataValue === 'function') {
        dataPromise = staticDataValue();
      } else if (staticDataValue) {
        dataPromise = Promise.resolve(staticDataValue);
      }
    }

    if (!dataPromise) {
      dataPromise = pluginService.getBackendRecord(keyObject);
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
      dataPromise = pluginService.getBackendDevRecord(keyObject)?.catch(() => {
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
    fetchingObserver.update(isFetching());
    loadingObserver.update(isLoading());

    const results = await Promise.all(withPromises.map((val) => val.promise));

    withPromises.forEach((value, i) => {
      if (value.new) {
        asyncRequests.delete(value.cacheKey);
        const data = results[i];
        if (data) {
          cache.addRecord(value.keyObject, data, isDev());
        }
      }
    });
    fetchingObserver.update(isFetching());
    loadingObserver.update(isLoading());

    return withPromises.map((val) => cache.getRecord(val.keyObject)!);
  }

  async function loadRecord(descriptor: CacheDescriptor) {
    const result = await loadRecords([descriptor]);
    return result[0];
  }

  function loadInitial() {
    const data = valueOrPromise(initializeLanguage(), () => {
      state.getLanguageOrFail();
      return loadRequiredRecords();
    });

    if (isPromise(data)) {
      state.setInitialLoading(true);
      fetchingObserver.update(isFetching());
      loadingObserver.update(isLoading());
      return Promise.resolve(data).then(() => {
        state.setInitialLoading(false);
        fetchingObserver.update(isFetching());
        loadingObserver.update(isLoading());
        events.onInitialLoaded.emit();
      });
    } else {
      events.onInitialLoaded.emit();
    }
  }

  function initializeLanguage() {
    const existingLanguage = state.getLanguage();
    if (existingLanguage) {
      state.setLanguage(existingLanguage);
      return;
    }
    if (!state.getInitialOptions().defaultLanguage) {
      throw new Error(missingOptionError('defaultLanguage'));
    }
    const languageOrPromise = pluginService.getInitialLanguage();
    return valueOrPromise(languageOrPromise, (lang) => {
      const language =
        (lang as string | undefined) ||
        state.getInitialOptions().defaultLanguage;
      language && state.setLanguage(language);
    });
  }

  function run() {
    if (!state.isRunning()) {
      state.setRunning(true);
      pluginService.run(isDev());
      return loadInitial();
    }
  }

  function stop() {
    if (state.isRunning()) {
      pluginService.stop(isDev());
      state.setRunning(false);
    }
  }

  return Object.freeze({
    ...state,
    ...pluginService,
    init,
    changeLanguage,
    getTranslation,
    changeTranslation,
    addActiveNs,
    loadRequiredRecords,
    loadRecords,
    loadRecord,
    isLoading,
    isFetching,
    isLoaded,
    t,
    isDev,
    run,
    stop,
  });
};

export type StateServiceType = ReturnType<typeof Controller>;
