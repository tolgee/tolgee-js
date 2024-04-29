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

export function Controller({ options }: StateServiceProps) {
  const events = Events(getFallbackNs, getDefaultNs);
  const fetchingObserver = ValueObserver<boolean>(
    false,
    () => cache.isFetching(),
    events.onFetchingChange.emit
  );
  const loadingObserver = ValueObserver<boolean>(
    false,
    () => self.isLoading(),
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
    getDefaultAndFallbackNs,
    getTranslationNs,
    getTranslation,
    changeTranslation,
    events
  );

  const cache = Cache(
    events,
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

  let runPromise: Promise<any> | undefined;

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
      ...getFallbackArray(ns ?? getDefaultNs()),
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
      revert() {
        cache.changeTranslation(keyObject, key, previousValue);
      },
    };
  }

  function init(options: Partial<TolgeeOptions>) {
    state.init(options);
    cache.addStaticData(state.getInitialOptions().staticData);
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

  function loadRequiredRecords(lang?: string, ns?: NsFallback) {
    const descriptors = getRequiredRecords(lang, ns);
    if (descriptors.length) {
      return valueOrPromise(self.loadRecords(descriptors), () => {});
    }
  }

  function getTranslationNs({ key, ns }: KeyAndNamespacesInternal) {
    const languages = state.getFallbackLangs();
    const namespaces = getDefaultAndFallbackNs(ns ?? undefined);
    return cache.getTranslationNs(namespaces, languages, key);
  }

  function getTranslation({ key, ns, language }: KeyAndNamespacesInternal) {
    const namespaces = getDefaultAndFallbackNs(ns ?? undefined);
    const languages = state.getFallbackLangs(language);
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
    const languageOrPromise = pluginService.getInitialLanguage();

    return valueOrPromise(languageOrPromise, (lang) => {
      const language =
        (lang as string | undefined) ||
        state.getInitialOptions().defaultLanguage;
      language && state.setLanguage(language);
    });
  }

  function checkCorrectConfiguration() {
    const languageComputable =
      pluginService.getLanguageDetector() || pluginService.getLanguageStorage();
    if (languageComputable) {
      const availableLanguages = state.getAvailableLanguages();
      if (!availableLanguages) {
        throw new Error(missingOptionError('availableLanguages'));
      }
    }
    if (!state.getLanguage() && !state.getInitialOptions().defaultLanguage) {
      throw new Error(missingOptionError(['defaultLanguage', 'language']));
    }
  }

  const self = Object.freeze({
    ...events,
    ...state,
    ...pluginService,
    ...cache,
    init: init,
    getTranslation: getTranslation,
    changeTranslation: changeTranslation,
    getTranslationNs: getTranslationNs,
    getDefaultAndFallbackNs: getDefaultAndFallbackNs,
    findPositions: pluginService.findPositions,
    getRequiredRecords: getRequiredRecords,
    async changeLanguage(language: string) {
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
        await pluginService.setStoredLanguage(language);
      }
    },

    async addActiveNs(ns: NsFallback, forget?: boolean) {
      if (!forget) {
        state.addActiveNs(ns);
      }
      if (state.isRunning()) {
        await loadRequiredRecords(undefined, ns);
      }
    },

    loadRecords(descriptors: CacheDescriptor[]) {
      return cache.loadRecords(descriptors, self.isDev());
    },

    async loadRecord(descriptor: CacheDescriptor) {
      return (await self.loadRecords([descriptor]))[0];
    },

    isLoading(ns?: NsFallback) {
      return cache.isLoading(state.getLanguage()!, ns);
    },

    isLoaded(ns?: NsFallback) {
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
    },

    t: ((...args: Parameters<TFnType>) => {
      // @ts-ignore
      const params = getTranslateProps(...args);
      const translation = getTranslation(params);
      return pluginService.formatTranslation({ ...params, translation });
    }) as TFnType,

    isDev() {
      return Boolean(
        state.getInitialOptions().apiKey && state.getInitialOptions().apiUrl
      );
    },

    run() {
      checkCorrectConfiguration();
      if (!state.isRunning()) {
        state.setRunning(true);
        pluginService.run();
        runPromise = loadInitial();
      }
      return Promise.resolve(runPromise);
    },

    stop() {
      if (state.isRunning()) {
        pluginService.stop();
        state.setRunning(false);
      }
    },
  });

  return self;
}

export type ControllerInstance = ReturnType<typeof Controller>;
