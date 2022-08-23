import { EventService } from './EventService';
import { StateService } from './StateService/StateService';
import { Options } from './types';

export const Tolgee = (options: Options) => {
  const eventService = EventService();
  const stateService = StateService(options, eventService);

  return Object.freeze({
    onLanguageChange: eventService.onLanguageChange,
    onPendingLanguageChange: eventService.onPendingLanguageChange,
    onFetchingChange: eventService.onFetchingChange,
    onKeyUpdate: eventService.onKeyUpdate,
    onLoad: eventService.onInitialLoaded,
    getLanguage: () => stateService.state.language,
    getPendingLanguage: () => stateService.state.pendingLanguage,
    changeLanguage: stateService.changeLanguage,
    changeTranslation: stateService.changeTranslation,
    instant: stateService.getTranslation,
    addActiveNs: stateService.addActiveNs,
    removeActiveNs: stateService.removeActiveNs,
    loadRecord: stateService.loadRecord,
    isLoading: () => stateService.state.isLoading,
    isFetching: () => stateService.isFetching(),
    run: () => stateService.loadInitial(),
  });
};

export type TolgeeType = ReturnType<typeof Tolgee>;
