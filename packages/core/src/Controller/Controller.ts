import type { EventServiceType } from '../Events/Events';
import {
  CacheDescriptor,
  FallbackNSTranslation,
  Options,
  TranslatePropsInternal,
} from '../types';
import { Cache } from './Cache/Cache';
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
  const fetchingObserver = ValueObserver<boolean>(
    false,
    () => cache.isFetching(),
    events.onFetchingChange.emit
  );
  const loadingObserver = ValueObserver<boolean>(
    false,
    () => isLoading(),
    events.onLoadingChange.emit
  );

  const state = State(
    events.onLanguageChange,
    events.onPendingLanguageChange,
    events.onRunningChange
  );

  const pluginService = PluginService(
    t,
    state.getLanguage,
    state.getInitialOptions,
    state.getAvailableLanguages,
    getTranslationNs,
    getTranslation,
    changeTranslation
  );

  const cache = Cache(
    events.onCacheChange,
    pluginService.getBackendRecord,
    pluginService.getBackendDevRecord,
    state.withDefaultNs,
    state.isInitialLoading,
    fetchingObserver,
    loadingObserver
  );

  state.init(options);
  cache.init(state.getInitialOptions().staticData);

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
    const keyObject = state.withDefaultNs(descriptor);
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
    cache.init(state.getInitialOptions().staticData);
    if (isDev()) {
      cache.invalidate();
    }
  }

  function isLoading(ns?: FallbackNSTranslation) {
    return cache.isLoading(state.getLanguage()!, ns);
  }

  function isDev() {
    return Boolean(
      state.getInitialOptions().apiKey && pluginService.getDevBackend()
    );
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
        if (!cache.exists({ language, namespace }, true)) {
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
      return valueOrPromise(cache.loadRecords(descriptors, isDev()), () => {});
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

  function loadInitial() {
    const data = valueOrPromise(initializeLanguage(), () => {
      // fail if there is no language
      state.getLanguageOrFail();
      return loadRequiredRecords();
    });

    if (isPromise(data)) {
      state.setInitialLoading(true);
      fetchingObserver.notify();
      loadingObserver.notify();
      return Promise.resolve(data).then(() => {
        state.setInitialLoading(false);
        fetchingObserver.notify();
        loadingObserver.notify();
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
    let result: Promise<void> | undefined = undefined;
    if (!state.isRunning()) {
      state.setRunning(true);
      pluginService.run();
      result = loadInitial();
    }
    return Promise.resolve(result);
  }

  function stop() {
    if (state.isRunning()) {
      pluginService.stop();
      state.setRunning(false);
    }
  }

  return Object.freeze({
    ...state,
    ...pluginService,
    ...cache,
    init,
    changeLanguage,
    getTranslation,
    changeTranslation,
    addActiveNs,
    loadRequiredRecords,
    isLoading,
    isLoaded,
    t,
    isDev,
    run,
    stop,
  });
};

export type StateServiceType = ReturnType<typeof Controller>;
