import type { EventServiceType } from '../EventService/EventService';
import {
  BackendDevProps,
  CacheAsyncRequests,
  CacheDescriptor,
  CacheDescriptorInternal,
  FallbackNSTranslation,
  Options,
  TranslatePropsInternal,
  TreeTranslationsData,
  UiProps,
} from '../types';
import { Cache } from './Cache/Cache';
import { decodeCacheKey, encodeCacheKey } from './Cache/helpers';
import { getFallbackArray } from './State/helpers';
import { PluginService } from './PluginService/PluginService';
import { ValueObserver } from './ValueObserver';
import { State } from './State/State';

type StateServiceProps = {
  eventService: EventServiceType;
  options?: Partial<Options>;
};

export const StateService = ({ eventService, options }: StateServiceProps) => {
  const state = State({
    onLanguageChange: eventService.onLanguageChange,
    onPendingLanguageChange: eventService.onPendingLanguageChange,
    onRunningChange: eventService.onRunningChange,
  });
  const cache = Cache({
    onCacheChange: eventService.onCacheChange,
  });
  const asyncRequests: CacheAsyncRequests = new Map();
  const pluginService = PluginService(
    state.getLanguage,
    t,
    getBackendProps,
    getUiProps,
    getTranslationNs,
    getTranslation
  );

  state.init(options);
  cache.init(state.getInitialOptions().staticData);
  const fetchingObserver = ValueObserver<boolean>(
    false,
    eventService.onFetchingChange.emit
  );
  const loadingObserver = ValueObserver<boolean>(
    false,
    eventService.onLoadingChange.emit
  );

  eventService.onKeyUpdate.listen(() => {
    if (state.isRunning()) {
      pluginService.retranslate();
    }
  });

  function t(props: TranslatePropsInternal) {
    const translation = getTranslation(props);
    return pluginService.formatTranslation({ ...props, translation });
  }

  function getBackendProps(): BackendDevProps {
    const apiUrl = state.getInitialOptions().apiUrl;
    return {
      apiUrl: apiUrl ? apiUrl.replace(/\/+$/, '') : apiUrl,
      apiKey: state.getInitialOptions().apiKey,
      projectId: state.getInitialOptions().projectId,
    };
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

  function getUiProps(): UiProps {
    return {
      apiKey: state.getInitialOptions().apiKey!,
      apiUrl: state.getInitialOptions().apiUrl!,
      highlight: pluginService.highlight,
      changeTranslation,
    };
  }

  function init(options: Partial<Options>) {
    state.init(options);
    cache.clear();
    cache.init(state.getInitialOptions().staticData);
  }

  function isFetching(ns?: FallbackNSTranslation) {
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
      Array.from(asyncRequests.keys()).find((key) => {
        const descriptor = decodeCacheKey(key);
        return (
          (!namespaces.length || namespaces.includes(descriptor.namespace)) &&
          !cache.exists({
            namespace: descriptor.namespace,
            language: state.getLanguage(),
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
    const languages = state.getFallbackLangs(state.getLanguage());
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

  async function loadRequiredRecords(
    lang?: string,
    ns?: FallbackNSTranslation
  ) {
    const descriptors = getRequiredRecords(lang, ns);
    await loadRecords(descriptors);
  }

  async function loadInitial() {
    state.setInitialLoading(true);
    await loadRequiredRecords();
    state.setInitialLoading(false);
    eventService.onInitialLoaded.emit();
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

  async function run() {
    if (!state.isRunning()) {
      state.setRunning(true);
      pluginService.run(isDev());
      await loadInitial();
    }
  }

  function stop() {
    if (state.isRunning()) {
      pluginService.stop(isDev());
      state.setRunning(false);
    }
  }

  return Object.freeze({
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
    loadInitial,
    t,
    isDev,
    getLanguage: state.getLanguage,
    getPendingLanguage: state.getPendingLanguage,
    removeActiveNs: state.removeActiveNs,
    isInitialLoading: state.isInitialLoading,
    isRunning: state.isRunning,
    getInitialOptions: state.getInitialOptions,
    setFinalFormatter: pluginService.setFinalFormatter,
    addFormatter: pluginService.addFormatter,
    setObserver: pluginService.setObserver,
    setUi: pluginService.setUi,
    setDevBackend: pluginService.setDevBackend,
    addBackend: pluginService.addBackend,
    highlight: pluginService.highlight,
    run,
    stop,
  });
};

export type StateServiceType = ReturnType<typeof StateService>;
