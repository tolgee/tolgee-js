import {
  CacheDescriptor,
  CacheDescriptorInternal,
  EventEmitterType,
  FallbackNSTranslation,
} from '../../types';
import { decodeCacheKey } from '../Cache/helpers';
import { getFallbackArray, getFallbackFromStruct, unique } from './helpers';
import { initState, Options } from './initState';

export const State = (
  onLanguageChange: EventEmitterType<string>,
  onPendingLanguageChange: EventEmitterType<string>,
  onRunningChange: EventEmitterType<boolean>
) => {
  let state = initState();

  function init(options?: Partial<Options>) {
    state = initState(options, state);
  }

  function isRunning() {
    return state.isRunning;
  }

  function setRunning(value: boolean) {
    if (state.isRunning !== value) {
      state.isRunning = value;
      onRunningChange.emit(value);
    }
  }

  function isInitialLoading() {
    return state.isInitialLoading;
  }

  function setInitialLoading(value: boolean) {
    state.isInitialLoading = value;
  }

  function getLanguage() {
    return state.language || state.initialOptions.language;
  }

  function getLanguageOrFail() {
    const language = state.language || state.initialOptions.language;
    if (!language) {
      throw new Error(`No language set`);
    }
    return language;
  }

  function setLanguage(language: string) {
    if (state.language !== language) {
      state.language = language;
      onLanguageChange.emit(language);
    }
  }

  function getPendingLanguage() {
    return state.pendingLanguage || getLanguage();
  }

  function setPendingLanguage(language: string) {
    if (state.pendingLanguage !== language) {
      state.pendingLanguage = language;
      onPendingLanguageChange.emit(language);
    }
  }

  function getInitialOptions() {
    return state.initialOptions;
  }

  function addActiveNs(ns: FallbackNSTranslation) {
    const namespaces = getFallbackArray(ns);
    namespaces.forEach((namespace) => {
      const value = state.activeNamespaces.get(namespace);
      if (value !== undefined) {
        state.activeNamespaces.set(namespace, value + 1);
      } else {
        state.activeNamespaces.set(namespace, 1);
      }
    });
  }

  function removeActiveNs(ns: FallbackNSTranslation) {
    const namespaces = getFallbackArray(ns);
    namespaces.forEach((namespace) => {
      const value = state.activeNamespaces.get(namespace);
      if (value !== undefined && value > 1) {
        state.activeNamespaces.set(namespace, value - 1);
      } else {
        state.activeNamespaces.delete(namespace);
      }
    });
  }

  function getRequiredNamespaces() {
    return unique([
      ...(state.initialOptions.ns || [state.initialOptions.defaultNs]),
      ...state.activeNamespaces.keys(),
    ]);
  }

  function getFallbackLangs(lang?: string) {
    const language = lang || getLanguage();
    if (!language) {
      return [];
    }
    return unique([
      language,
      ...getFallbackFromStruct(language, state.initialOptions.fallbackLanguage),
    ]);
  }

  function getFallbackNamespaces() {
    const defaultNs = state.initialOptions.defaultNs;
    const fallbackNs = state.initialOptions.fallbackNs;
    const fallbackNamespaces = typeof defaultNs === 'string' ? [defaultNs] : [];
    return unique([...fallbackNamespaces, ...getFallbackArray(fallbackNs)]);
  }

  function getAvailableLanguages() {
    if (state.initialOptions.availableLanguages) {
      return state.initialOptions.availableLanguages;
    } else if (state.initialOptions.staticData) {
      const languagesFromStaticData = Object.keys(
        state.initialOptions.staticData
      ).map((key) => decodeCacheKey(key).language);
      return Array.from(new Set(languagesFromStaticData));
    }
  }

  function withDefaultNs(descriptor: CacheDescriptor): CacheDescriptorInternal {
    return {
      namespace:
        descriptor.namespace === undefined
          ? getInitialOptions().defaultNs
          : descriptor.namespace,
      language: descriptor.language,
    };
  }

  return Object.freeze({
    init,
    isRunning,
    setRunning,
    isInitialLoading,
    setInitialLoading,
    getLanguage,
    getLanguageOrFail,
    setLanguage,
    getPendingLanguage,
    setPendingLanguage,
    getInitialOptions,
    addActiveNs,
    removeActiveNs,
    getRequiredNamespaces,
    getFallbackLangs,
    getFallbackNamespaces,
    getAvailableLanguages,
    withDefaultNs,
  });
};
