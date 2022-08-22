import { EventService } from './EventService';
import { StateService } from './StateService/StateService';
import { Options } from './types';

export const Tolgee = (options: Options) => {
  const eventService = EventService();
  const stateService = StateService(options, eventService);

  return Object.freeze({
    onLanguageChange: eventService.onLanguageChange,
    onPendingLanguageChange: eventService.onPendingLanguageChange,
    onKeyUpdate: eventService.onKeyUpdate,
    getLanguage: () => stateService.getState().language,
    getPendingLanguage: () => stateService.getState().pendingLanguage,
    changeLanguage: stateService.changeLanguage,
    changeTranslation: stateService.changeTranslation,
    instant: stateService.getTranslation,
  });
};

export type TolgeeType = ReturnType<typeof Tolgee>;
