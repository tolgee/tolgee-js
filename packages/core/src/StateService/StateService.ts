import { EventServiceType } from '../EventService';
import { CacheDescriptor, State } from '../types';
import {
  cacheAddRecord,
  cacheGetRecord,
  cacheGetTranslation,
} from './Cache/Cache';
import { encodeCacheKey } from './Cache/helpers';

export const StateService = (
  initialState: State,
  eventService: EventServiceType
) => {
  const state: State = {
    ...initialState,
  };

  const changeLanguage = async (language: string) => {
    state.pendingLanguage = language;
    eventService.onPendingLanguageChange.emit(language);
    if (!cacheGetRecord(state.cache, { language })) {
      await loadRecord({ language });
    }
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
      { workspace, language: state.language },
      key
    );
  };

  const loadRecord = async (descriptor: CacheDescriptor) => {
    const staticDataValue =
      state.initialOptions.staticData?.[encodeCacheKey(descriptor)];
    if (typeof staticDataValue === 'function') {
      const data = await staticDataValue();
      cacheAddRecord(state.cache, descriptor, 'prod', data);
    }
  };

  return Object.freeze({
    getState: () => state,
    changeLanguage,
    getTranslation,
  });
};
