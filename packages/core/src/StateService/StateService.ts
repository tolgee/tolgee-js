import type { EventServiceType } from '../EventService/EventService';
import {
  CacheAsyncRequests,
  CacheDescriptor,
  CacheKeyObject,
  Options,
  TranslatePropsInternal,
  TreeTranslationsData,
  UiProps,
} from '../types';
import { Cache } from './Cache/Cache';
import { decodeCacheKey, encodeCacheKey } from './Cache/helpers';
import { getFallback } from './State/helpers';
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
  const cache = Cache();
  const asyncRequests: CacheAsyncRequests = new Map();
  const pluginService = PluginService(
    state.getLanguage,
    t,
    getBackendProps,
    getUiProps
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

  function getBackendProps() {
    const apiUrl = state.getInitialOptions().apiUrl;
    return {
      apiUrl: apiUrl ? apiUrl.replace(/\/+$/, '') : apiUrl,
      apiKey: state.getInitialOptions().apiKey,
    };
  }

  function getUiProps(): UiProps {
    return {
      getTranslation: (key) => t({ key, noWrap: true, orEmpty: true }),
      apiKey: state.getInitialOptions().apiKey!,
      apiUrl: state.getInitialOptions().apiUrl!,
    };
  }

  function init(options: Partial<Options>) {
    state.init(options);
    cache.init(state.getInitialOptions().staticData);
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
            language: state.getLanguage(),
          })
      )
    );
  }

  function withDefaultNs(descriptor: CacheDescriptor): CacheKeyObject {
    return {
      namespace:
        descriptor.namespace === undefined
          ? state.getInitialOptions().defaultNs
          : descriptor.namespace,
      language: descriptor.language,
    };
  }

  async function addActiveNs(namespace: string) {
    state.addActiveNs(namespace);
    if (state.isRunning()) {
      const data = cache.getRecord({
        language: state.getLanguage(),
        namespace,
      });
      if (!data) {
        await loadRecord({ namespace, language: state.getLanguage() });
      }
    }
  }

  function getRequiredRecords(lang?: string) {
    const languages = state.getFallbackLangs(lang);
    const namespaces = state.getRequiredNamespaces();
    const result: CacheDescriptor[] = [];
    languages.forEach((language) => {
      namespaces.forEach((namespace) => {
        if (!cache.exists({ language, namespace }, state.isDev())) {
          result.push({ language, namespace });
        }
      });
    });
    return result;
  }

  function isLoaded() {
    return getRequiredRecords().length === 0;
  }

  async function loadRequiredRecords(lang?: string) {
    const requests = [] as Array<ReturnType<typeof loadRecord>>;
    getRequiredRecords(lang).forEach((descriptor) =>
      requests.push(loadRecord(descriptor))
    );
    await Promise.all(requests);
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

  function getTranslation({
    key,
    ns,
    fallbackLanguages,
  }: TranslatePropsInternal) {
    const namespaces = ns ? getFallback(ns) : state.getFallbackNamespaces();
    const languages = fallbackLanguages
      ? [state.getLanguage(), ...getFallback(fallbackLanguages)]
      : state.getFallbackLangs();
    return cache.getTranslationFallback(namespaces, languages, key);
  }

  function changeTranslation(
    descriptor: CacheDescriptor,
    key: string,
    value: string
  ) {
    const keyObject = withDefaultNs(descriptor);
    cache.changeTranslation(keyObject, key, value);
    eventService.onKeyChange.emit({ key, ns: [keyObject.namespace] });
  }

  function fetchNormal(keyObject: CacheKeyObject) {
    let dataPromise = undefined as Promise<TreeTranslationsData> | undefined;
    if (!dataPromise) {
      dataPromise = pluginService.getBackendRecord(keyObject);
    }

    if (!dataPromise) {
      const staticDataValue =
        state.getInitialOptions().staticData?.[encodeCacheKey(keyObject)];
      if (typeof staticDataValue === 'function') {
        dataPromise = staticDataValue();
      }
    }
    return dataPromise;
  }

  function fetchData(keyObject: CacheKeyObject) {
    let dataPromise = undefined as
      | Promise<TreeTranslationsData | undefined>
      | undefined;
    if (state.isDev()) {
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
      if (data) {
        cache.addRecord(keyObject, data, state.isDev());
        eventService.onCacheChange.emit(keyObject);
      }
      fetchingObserver.update(isFetching());
      loadingObserver.update(isLoading());
    }

    return cache.getRecord(withDefaultNs(descriptor));
  }

  function run() {
    if (!state.isRunning()) {
      pluginService.run();
      state.setRunning(true);
    }
  }

  function stop() {
    if (state.isRunning()) {
      pluginService.stop();
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
    loadRecord,
    isLoading,
    isFetching,
    isLoaded,
    loadInitial,
    t,
    getLanguage: state.getLanguage,
    getPendingLanguage: state.getPendingLanguage,
    removeActiveNs: state.removeActiveNs,
    isInitialLoading: state.isInitialLoading,
    isRunning: state.isRunning,
    setFinalFormatter: pluginService.setFinalFormatter,
    addFormatter: pluginService.addFormatter,
    setObserver: pluginService.setObserver,
    setUi: pluginService.setUi,
    setDevBackend: pluginService.setDevBackend,
    addBackend: pluginService.addBackend,
    run,
    stop,
  });
};

export type StateServiceType = ReturnType<typeof StateService>;
