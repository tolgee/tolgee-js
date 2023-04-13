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

export function State(
  onLanguageChange: EventEmitterInstance<string>,
  onPendingLanguageChange: EventEmitterInstance<string>,
  onRunningChange: EventEmitterInstance<boolean>
) {
  let state = initState();
  let devCredentials: DevCredentials = undefined;

  const self = Object.freeze({
    init(options?: Partial<TolgeeOptions>) {
      state = initState(options, state);
    },

    isRunning() {
      return state.isRunning;
    },

    setRunning(value: boolean) {
      if (state.isRunning !== value) {
        state.isRunning = value;
        onRunningChange.emit(value);
      }
    },

    isInitialLoading() {
      return state.isInitialLoading;
    },

    setInitialLoading(value: boolean) {
      state.isInitialLoading = value;
    },

    getLanguage() {
      return state.language || state.initialOptions.language;
    },

    setLanguage(language: string) {
      if (state.language !== language) {
        state.language = language;
        onLanguageChange.emit(language);
      }
    },

    getPendingLanguage() {
      return state.pendingLanguage || self.getLanguage();
    },

    setPendingLanguage(language: string) {
      if (state.pendingLanguage !== language) {
        state.pendingLanguage = language;
        onPendingLanguageChange.emit(language);
      }
    },

    getInitialOptions() {
      return { ...state.initialOptions, ...devCredentials };
    },

    addActiveNs(ns: NsFallback) {
      const namespaces = getFallbackArray(ns);
      namespaces.forEach((namespace) => {
        const value = state.activeNamespaces.get(namespace);
        if (value !== undefined) {
          state.activeNamespaces.set(namespace, value + 1);
        } else {
          state.activeNamespaces.set(namespace, 1);
        }
      });
    },

    removeActiveNs(ns: NsFallback) {
      const namespaces = getFallbackArray(ns);
      namespaces.forEach((namespace) => {
        const value = state.activeNamespaces.get(namespace);
        if (value !== undefined && value > 1) {
          state.activeNamespaces.set(namespace, value - 1);
        } else {
          state.activeNamespaces.delete(namespace);
        }
      });
    },
    getRequiredNamespaces() {
      return unique([
        ...(state.initialOptions.ns || [state.initialOptions.defaultNs]),
        ...getFallbackArray(state.initialOptions.fallbackNs),
        ...state.activeNamespaces.keys(),
      ]);
    },

    getFallbackLangs(lang?: string) {
      const language = lang || self.getLanguage();
      if (!language) {
        return [];
      }
      return unique([
        language,
        ...getFallbackFromStruct(
          language,
          state.initialOptions.fallbackLanguage
        ),
      ]);
    },

    getFallbackNs() {
      return getFallbackArray(state.initialOptions.fallbackNs);
    },

    getDefaultNs(ns?: NsType) {
      return ns === undefined ? state.initialOptions.defaultNs : ns;
    },

    getAvailableLanguages() {
      if (state.initialOptions.availableLanguages) {
        return state.initialOptions.availableLanguages;
      } else if (state.initialOptions.staticData) {
        const languagesFromStaticData = Object.keys(
          state.initialOptions.staticData
        ).map((key) => decodeCacheKey(key).language);
        return Array.from(new Set(languagesFromStaticData));
      }
    },

    withDefaultNs(descriptor: CacheDescriptor): CacheDescriptorInternal {
      return {
        namespace:
          descriptor.namespace === undefined
            ? self.getInitialOptions().defaultNs
            : descriptor.namespace,
        language: descriptor.language,
      };
    },

    overrideCredentials(credentials: DevCredentials) {
      if (credentials) {
        devCredentials = {
          ...credentials,
          apiUrl: sanitizeUrl(credentials.apiUrl),
        };
      } else {
        devCredentials = undefined;
      }
    },
  });
  return self;
}

export type StateInstance = ReturnType<typeof State>;
