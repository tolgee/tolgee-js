import type { EventServiceType } from '../EventService/EventService';
import {
  CacheAsyncRequests,
  CacheDescriptor,
  CacheKeyObject,
  Options,
  TranslatePropsInternal,
  TreeTranslationsData,
} from '../types';
import { Cache } from './Cache/Cache';
import { decodeCacheKey, encodeCacheKey } from './Cache/helpers';
import { getFallback, getFallbackFromStruct } from './helpers';
import { initState, State } from './initState';
import { PluginService } from './PluginService/PluginService';
import { ValueObserver } from './ValueObserver';

type StateServiceProps = {
  eventService: EventServiceType;
  options?: Partial<Options>;
};

export const StateService = ({ eventService, options }: StateServiceProps) => {
  let state: State = initState(options);
  const cache = Cache();
  cache.init(state.initialOptions.staticData);
  const pluginService = PluginService(getLanguage, t, getBackendProps);
  const fetchingObserver = ValueObserver(eventService.onFetchingChange.emit);
  const loadingObserver = ValueObserver(eventService.onLoadingChange.emit);

  function t(props: TranslatePropsInternal) {
    const translation = getTranslation(props);
    return pluginService.formatTranslation({ ...props, translation });
  }

  function getBackendProps() {
    const apiUrl = state.initialOptions.apiUrl;
    return {
      apiUrl: apiUrl ? apiUrl.replace(/\/+$/, '') : apiUrl,
      apiKey: state.initialOptions.apiKey,
    };
  }

  const asyncRequests: CacheAsyncRequests = new Map();

  function init(options: Partial<Options>) {
    state = initState(options, state.initialOptions);
    cache.init(state.initialOptions.staticData);
  }

  function isDev() {
    return Boolean(state.initialOptions.apiKey);
  }

  function isFetching() {
    return asyncRequests.size > 0;
  }

  function isLoading() {
    return Boolean(
      Array.from(asyncRequests.keys()).find(
        (key) =>
          !cache.exists({
            namespace: decodeCacheKey(key).namespace,
            language: state.language,
          })
      )
    );
  }

  function isInitialLoading() {
    return state.isInitialLoading;
  }

  function getLanguage() {
    return state.language;
  }

  function getPendingLanguage() {
    return state.pendingLanguage;
  }

  function withDefaultNs(descriptor: CacheDescriptor): CacheKeyObject {
    return {
      namespace:
        descriptor.namespace === undefined
          ? state.initialOptions.defaultNs
          : descriptor.namespace,
      language: descriptor.language,
    };
  }

  async function addActiveNs(namespace: string) {
    const value = state.activeNamespaces.get(namespace);
    if (value !== undefined) {
      state.activeNamespaces.set(namespace, value + 1);
    } else {
      state.activeNamespaces.set(namespace, 1);
    }
    const data = cache.getRecord({
      language: state.language,
      namespace,
    });
    if (!data) {
      await loadRecord({ namespace, language: state.language });
    }
  }

  function removeActiveNs(ns: string) {
    const value = state.activeNamespaces.get(ns);
    if (value !== undefined && value > 1) {
      state.activeNamespaces.set(ns, value - 1);
    } else {
      state.activeNamespaces.delete(ns);
    }
  }

  function getFallbackNamespaces() {
    const defaultNs = state.initialOptions.defaultNs;
    const fallbackNs = state.initialOptions.fallbackNs;
    const fallbackNamespaces = typeof defaultNs === 'string' ? [defaultNs] : [];
    return [...fallbackNamespaces, ...getFallback(fallbackNs)];
  }

  function getFallbackLangs(lang?: string) {
    const language = lang || state.language;
    return [
      language,
      ...getFallbackFromStruct(language, state.initialOptions.fallbackLanguage),
    ];
  }

  function getRequiredNamespaces() {
    return Array.from(
      new Set([
        ...(state.initialOptions.ns || [state.initialOptions.defaultNs]),
        ...state.activeNamespaces.keys(),
      ])
    );
  }

  async function loadRequiredRecords(lang?: string) {
    const languages = new Set(getFallbackLangs(lang));
    const namespaces = new Set(getRequiredNamespaces());
    const requests: ReturnType<typeof loadRecord>[] = [];
    languages.forEach((language) => {
      namespaces.forEach((namespace) => {
        if (!cache.exists({ language, namespace }, isDev())) {
          requests.push(loadRecord({ language, namespace }));
        }
      });
    });
    await Promise.all(requests);
  }

  async function loadInitial() {
    state.isInitialLoading = true;
    await loadRequiredRecords();
    state.isInitialLoading = false;
    eventService.onInitialLoaded.emit();
  }

  async function changeLanguage(language: string) {
    if (state.pendingLanguage === language && state.language === language) {
      return;
    }
    state.pendingLanguage = language;
    eventService.onPendingLanguageChange.emit(language);

    await loadRequiredRecords(language);

    if (language === state.pendingLanguage) {
      // there might be parallel language change
      // we only want to apply latest
      state.language = language;
      eventService.onLanguageChange.emit(language);
    }
  }

  function getTranslation({
    key,
    ns,
    fallbackLanguages,
  }: TranslatePropsInternal) {
    const namespaces = ns ? getFallback(ns) : getFallbackNamespaces();
    const languages = fallbackLanguages
      ? [state.language, ...getFallback(fallbackLanguages)]
      : getFallbackLangs();
    return cache.getTranslationFallback(namespaces, languages, key);
  }

  function changeTranslation(
    descriptor: CacheDescriptor,
    key: string,
    value: string
  ) {
    const keyObject = withDefaultNs(descriptor);
    cache.changeTranslation(keyObject, key, value);
    eventService.onKeyChange.emit(key);
  }

  function fetchData(keyObject: CacheKeyObject) {
    let dataPromise = undefined as Promise<TreeTranslationsData> | undefined;
    if (isDev()) {
      dataPromise = pluginService.getBackendDevRecord(keyObject);
    }

    if (!dataPromise) {
      dataPromise = pluginService.getBackendRecord(keyObject);
    }

    if (!dataPromise) {
      const staticDataValue =
        state.initialOptions.staticData?.[encodeCacheKey(keyObject)];
      if (typeof staticDataValue === 'function') {
        dataPromise = staticDataValue();
      }
    }
    return dataPromise;
  }

  async function loadRecord(descriptor: CacheDescriptor) {
    const keyObject = withDefaultNs(descriptor);
    const cacheKey = encodeCacheKey(keyObject);
    const existingPromise = asyncRequests.get(cacheKey);

    if (existingPromise) {
      return existingPromise;
    }

    const dataPromise = fetchData(keyObject);
    if (dataPromise) {
      asyncRequests.set(cacheKey, dataPromise);
      fetchingObserver.update(isFetching());
      loadingObserver.update(isLoading());

      const data = await dataPromise;

      asyncRequests.delete(cacheKey);
      cache.addRecord(keyObject, data, isDev());
      fetchingObserver.update(isFetching());
      loadingObserver.update(isLoading());
    }

    return cache.getRecord(withDefaultNs(descriptor));
  }

  function run() {
    pluginService.run();
  }

  function stop() {
    pluginService.stop();
  }

  return Object.freeze({
    init,
    getLanguage,
    getPendingLanguage,
    changeLanguage,
    getTranslation,
    changeTranslation,
    addActiveNs,
    removeActiveNs,
    loadRequiredRecords,
    loadRecord,
    isLoading,
    isFetching,
    isInitialLoading,
    loadInitial,
    t,
    setFormatter: pluginService.setFormatter,
    setObserver: pluginService.setObserver,
    setUi: pluginService.setUi,
    setDevBackend: pluginService.setDevBackend,
    addBackend: pluginService.addBackend,
    run,
    stop,
  });
};

export type StateServiceType = ReturnType<typeof StateService>;
