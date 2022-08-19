import { EventService } from './EventService';
import { initState } from './StateService/initState';
import { StateService } from './StateService/StateService';
import { Options } from './types';

export const Tolgee = (options: Options) => {
  const eventService = EventService();
  const stateService = StateService(initState(options), eventService);

  return Object.freeze({
    onLanguageChange: eventService.onLanguageChange,
    onPendingLanguageChange: eventService.onPendingLanguageChange,
    getLanguage: () => stateService.getState().language,
    getPendingLanguage: () => stateService.getState().pendingLanguage,
    changeLanguage: stateService.changeLanguage,
    instant: stateService.getTranslation,
  });
};

export type TolgeeType = ReturnType<typeof Tolgee>;
