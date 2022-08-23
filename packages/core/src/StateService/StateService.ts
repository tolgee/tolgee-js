import { EventServiceType } from '../EventService';
import {
  CacheAsyncRequests,
  CacheDescriptor,
  CacheKeyObject,
  Options,
} from '../types';
import {
  cacheAddRecord,
  cacheChangeTranslation,
  cacheGetRecord,
  cacheGetTranslation,
} from './Cache/Cache';
import { encodeCacheKey } from './Cache/helpers';
import { initState, State } from './initState';

export const StateService = (
  options: Options,
  eventService: EventServiceType
) => {
  const state: State = initState(options);

  const asyncRequests: CacheAsyncRequests = new Map();

  const withDefaultNs = (descriptor: CacheDescriptor): CacheKeyObject => {
    return {
      namespace:
        descriptor.namespace === undefined
          ? state.initialOptions.defaultNs
          : descriptor.namespace,
      language: descriptor.language,
    };
  };

  const addActiveNs = async (namespace: string) => {
    const value = state.activeNamespaces.get(namespace);
    if (value !== undefined) {
      state.activeNamespaces.set(namespace, value + 1);
    } else {
      state.activeNamespaces.set(namespace, 1);
    }
    const data = cacheGetRecord(state.cache, {
      language: state.language,
      namespace,
    });
    if (!data) {
      await loadRecord({ namespace, language: state.language });
    }
  };

  const removeActiveNs = (ns: string) => {
    const value = state.activeNamespaces.get(ns);
    if (value !== undefined && value > 1) {
      state.activeNamespaces.set(ns, value - 1);
    } else {
      state.activeNamespaces.delete(ns);
    }
  };

  const getRequiredNamespaces = () => {
    return Array.from(
      new Set([
        ...(state.initialOptions.ns || [state.initialOptions.defaultNs]),
        ...state.activeNamespaces.keys(),
      ])
    );
  };

  const loadRequiredRecords = (lang?: string) => {
    const language = lang || state.language;
    const namespaces = getRequiredNamespaces();
    return Promise.all(
      namespaces
        .filter(
          (namespace) => !cacheGetRecord(state.cache, { language, namespace })
        )
        .map((namespace) => loadRecord({ language, namespace }))
    );
  };

  const changeLanguage = async (language: string) => {
    state.pendingLanguage = language;
    eventService.onPendingLanguageChange.emit(language);

    loadRequiredRecords(language);

    if (language === state.pendingLanguage) {
      // there might be parallel language change
      // we only want to apply latest
      state.language = language;
      eventService.onLanguageChange.emit(language);
    }
  };

  const getTranslation = (key: string, namespace?: string) => {
    return cacheGetTranslation(
      state.cache,
      withDefaultNs({ namespace, language: state.language }),
      key
    );
  };

  const changeTranslation = (
    descriptor: CacheDescriptor,
    key: string,
    value: string
  ) => {
    const keyObject = withDefaultNs(descriptor);
    cacheChangeTranslation(state.cache, keyObject, key, value);
    eventService.onKeyChange.emit(key);
  };

  const loadRecord = async (descriptor: CacheDescriptor) => {
    const keyObject = withDefaultNs(descriptor);
    const staticDataValue =
      state.initialOptions.staticData?.[encodeCacheKey(keyObject)];
    const cacheKey = encodeCacheKey(keyObject);
    const existingPromise = asyncRequests.get(cacheKey);

    if (existingPromise) {
      return existingPromise;
    }

    if (typeof staticDataValue === 'function') {
      const dataPromise = staticDataValue();
      asyncRequests.set(cacheKey, dataPromise);
      const data = await dataPromise;
      asyncRequests.delete(cacheKey);
      cacheAddRecord(state.cache, withDefaultNs(descriptor), 'prod', data);
    }
    return cacheGetRecord(state.cache, withDefaultNs(descriptor));
  };

  return Object.freeze({
    getState: () => state,
    changeLanguage,
    getTranslation,
    changeTranslation,
    addActiveNs,
    removeActiveNs,
    loadRequiredRecords,
    loadRecord,
  });
};
