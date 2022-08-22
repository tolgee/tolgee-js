import { EventServiceType } from '../EventService';
import { CacheAsyncRequests, CacheDescriptor, Options } from '../types';
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

  const changeLanguage = async (language: string) => {
    state.pendingLanguage = language;
    eventService.onPendingLanguageChange.emit(language);
    await Promise.all(
      state.initialOptions.initialNamespaces
        .filter(
          (namespace) => !cacheGetRecord(state.cache, { language, namespace })
        )
        .map((namespace) => loadRecord({ language, namespace }))
    );

    if (language === state.pendingLanguage) {
      // there might be parallel language change
      // we only want to apply latest
      state.language = language;
      eventService.onLanguageChange.emit(language);
    }
  };

  const getTranslation = (key: string, workspace?: string) => {
    return cacheGetTranslation(
      state.cache,
      { namespace: workspace, language: state.language },
      key
    );
  };

  const changeTranslation = (
    descriptor: CacheDescriptor,
    key: string,
    value: string
  ) => {
    cacheChangeTranslation(state.cache, descriptor, key, value);
    eventService.onKeyChange.emit(key);
  };

  const loadRecord = async (descriptor: CacheDescriptor) => {
    const staticDataValue =
      state.initialOptions.staticData?.[encodeCacheKey(descriptor)];
    const cacheKey = encodeCacheKey(descriptor);
    const existingPromise = asyncRequests.get(cacheKey);

    if (existingPromise) {
      return existingPromise;
    }

    if (typeof staticDataValue === 'function') {
      const dataPromise = staticDataValue();
      asyncRequests.set(cacheKey, dataPromise);
      const data = await dataPromise;
      asyncRequests.delete(cacheKey);
      cacheAddRecord(state.cache, descriptor, 'prod', data);
    }
  };

  return Object.freeze({
    getState: () => state,
    changeLanguage,
    getTranslation,
    changeTranslation,
  });
};
