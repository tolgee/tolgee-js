import {
  CacheDescriptor,
  CacheDescriptorInternal,
  DevCredentials,
  NsFallback,
  NsType,
} from '../../types';

import { decodeCacheKey } from '../Cache/helpers';
import { EventEmitterInstance } from '../Events/EventEmitter';
import {
  getFallbackArray,
  getFallbackFromStruct,
  sanitizeUrl,
  unique,
} from '../../helpers';
import { initState, TolgeeOptions } from './initState';

export const State = (
  onLanguageChange: EventEmitterInstance<string>,
  onPendingLanguageChange: EventEmitterInstance<string>,
  onRunningChange: EventEmitterInstance<boolean>
) => {
  let state = initState();
  let devCredentials: DevCredentials = undefined;

  function init(options?: Partial<TolgeeOptions>) {
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
    return { ...state.initialOptions, ...devCredentials };
  }

  function addActiveNs(ns: NsFallback) {
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

  function removeActiveNs(ns: NsFallback) {
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
      ...getFallbackArray(state.initialOptions.fallbackNs),
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

  function getFallbackNs() {
    return getFallbackArray(state.initialOptions.fallbackNs);
  }

  function getDefaultNs(ns?: NsType) {
    return ns === undefined ? state.initialOptions.defaultNs : ns;
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

  function overrideCredentials(credentials: DevCredentials) {
    if (credentials) {
      devCredentials = {
        ...credentials,
        apiUrl: sanitizeUrl(credentials.apiUrl),
      };
    } else {
      devCredentials = undefined;
    }
  }

  return Object.freeze({
    init,
    isRunning,
    setRunning,
    isInitialLoading,
    setInitialLoading,
    getLanguage,
    setLanguage,
    getPendingLanguage,
    setPendingLanguage,
    getInitialOptions,
    addActiveNs,
    removeActiveNs,
    getRequiredNamespaces,
    getFallbackLangs,
    getFallbackNs,
    getDefaultNs,
    getAvailableLanguages,
    withDefaultNs,
    overrideCredentials,
  });
};

export type StateInstance = ReturnType<typeof State>;
