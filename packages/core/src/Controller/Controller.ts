import { Events } from './Events/Events';
import {
  CacheDescriptor,
  NsFallback,
  TolgeeOptions,
  TFnType,
  NsType,
  KeyAndNamespacesInternal,
} from '../types';
import { Cache } from './Cache/Cache';
import { getFallbackArray } from '../helpers';
import { Plugins } from './Plugins/Plugins';
import { ValueObserver } from './ValueObserver';
import { State } from './State/State';
import { isPromise, missingOptionError, valueOrPromise } from '../helpers';
import { getTranslateProps } from '../TranslateParams';

type StateServiceProps = {
  options?: Partial<TolgeeOptions>;
};

export const Controller = ({ options }: StateServiceProps) => {
  const events = Events(getFallbackNs, getDefaultNs);
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

  const pluginService = Plugins(
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

  if (options) {
    init(options);
  }

  events.onUpdate.listen(() => {
    if (state.isRunning()) {
      pluginService.retranslate();
    }
  });

  function getFallbackNs() {
    return state.getFallbackNs();
  }

  function getDefaultNs(ns?: NsType) {
    return state.getDefaultNs(ns);
  }

  // gets all namespaces where translation could be located
  // takes (ns|default, fallback ns)
  function getDefaultAndFallbackNs(ns?: NsType) {
    return [...getFallbackArray(getDefaultNs(ns)), ...getFallbackNs()];
  }

  // gets all namespaces which need to be loaded
  // takes (ns|default, initial ns, fallback ns, active ns)
  function getRequiredNamespaces(ns: NsFallback) {
    return [
      ...getFallbackArray(ns || getDefaultNs()),
      ...state.getRequiredNamespaces(),
    ];
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

  function init(options: Partial<TolgeeOptions>) {
    state.init(options);
    cache.addStaticData(state.getInitialOptions().staticData);
  }

  function isLoading(ns?: NsFallback) {
    return cache.isLoading(state.getLanguage()!, ns);
  }

  function isDev() {
    return Boolean(
      state.getInitialOptions().apiKey && state.getInitialOptions().apiUrl
    );
  }

  async function addActiveNs(ns: NsFallback, forget?: boolean) {
    if (!forget) {
      state.addActiveNs(ns);
    }
    if (state.isRunning()) {
      await loadRequiredRecords(undefined, ns);
    }
  }

  function getRequiredRecords(lang?: string, ns?: NsFallback) {
    const languages = state.getFallbackLangs(lang);
    const namespaces = getRequiredNamespaces(ns);
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

  function isLoaded(ns?: NsFallback) {
    const language = state.getLanguage();
    if (!language) {
      return false;
    }
    const languages = state.getFallbackLangs(language);
    const namespaces = getRequiredNamespaces(ns);
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

  function loadRequiredRecords(lang?: string, ns?: NsFallback) {
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

  function getTranslationNs({ key, ns }: KeyAndNamespacesInternal) {
    const languages = state.getFallbackLangs();
    const namespaces = getDefaultAndFallbackNs(ns || undefined);
    return cache.getTranslationNs(namespaces, languages, key);
  }

  function getTranslation({ key, ns }: KeyAndNamespacesInternal) {
    const namespaces = getDefaultAndFallbackNs(ns || undefined);
    const languages = state.getFallbackLangs();
    return cache.getTranslationFallback(namespaces, languages, key);
  }

  function loadInitial() {
    const data = valueOrPromise(initializeLanguage(), () => {
      // fail if there is no language
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

  async function loadRecord(descriptor: CacheDescriptor) {
    return (await loadRecords([descriptor]))[0];
  }

  function loadRecords(descriptors: CacheDescriptor[]) {
    return cache.loadRecords(descriptors, isDev());
  }

  const checkCorrectConfiguration = () => {
    const languageComputable =
      pluginService.getLanguageDetector() || pluginService.getLanguageStorage();
    if (languageComputable) {
      const availableLanguages = state.getAvailableLanguages();
      if (!availableLanguages) {
        throw new Error(missingOptionError('availableLanguages'));
      }
    }
    if (!state.getLanguage() && !state.getInitialOptions().defaultLanguage) {
      if (languageComputable) {
        throw new Error(missingOptionError('defaultLanguage'));
      } else {
        throw new Error(missingOptionError('language'));
      }
    }
  };

  function run() {
    let result: Promise<void> | undefined = undefined;
    checkCorrectConfiguration();
    if (!state.isRunning()) {
      if (isDev()) {
        cache.invalidate();
      }
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

  const t: TFnType = (...args) => {
    // @ts-ignore
    const params = getTranslateProps(...args);
    const translation = getTranslation(params);
    return pluginService.formatTranslation({ ...params, translation });
  };

  return Object.freeze({
    ...events,
    ...state,
    ...pluginService,
    ...cache,
    init,
    changeLanguage,
    getTranslation,
    changeTranslation,
    addActiveNs,
    loadRecords,
    loadRecord,
    isLoading,
    isLoaded,
    t,
    isDev,
    run,
    stop,
  });
};

export type ControllerInstance = ReturnType<typeof Controller>;
