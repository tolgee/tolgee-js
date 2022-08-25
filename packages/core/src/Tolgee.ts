import { EventService } from './EventService';
import { PluginService } from './PluginService/PluginService';
import { StateService } from './StateService/StateService';
import { Options } from './types';

export const Tolgee = (options?: Options) => {
  const eventService = EventService();
  const stateService = StateService(eventService, options || {});
  const pluginService = PluginService(stateService.getLanguage);

  return Object.freeze({
    // event listeners
    onLanguageChange: eventService.onLanguageChange,
    onPendingLanguageChange: eventService.onPendingLanguageChange,
    onFetchingChange: eventService.onFetchingChange,
    onKeyUpdate: eventService.onKeyUpdate,
    onLoad: eventService.onInitialLoaded,

    // plugins
    setWrapper: pluginService.setWrapper,
    setFormat: pluginService.setFormat,
    setObserver: pluginService.setObserver,

    // state
    getLanguage: stateService.getLanguage,
    getPendingLanguage: stateService.getPendingLanguage,
    changeLanguage: stateService.changeLanguage,
    changeTranslation: stateService.changeTranslation,
    addActiveNs: stateService.addActiveNs,
    removeActiveNs: stateService.removeActiveNs,
    loadRecord: stateService.loadRecord,
    isLoading: stateService.isLoading,
    isFetching: stateService.isFetching,
    init: stateService.init,

    // other
    run: async () => {
      pluginService.run();
      await stateService.loadInitial();
    },
    stop: () => {
      pluginService.stop();
    },
    instant: (key: string, namespace?: string) => {
      const translation = stateService.getTranslation(key, namespace);
      return pluginService.formatTranslation(key, translation);
    },
  });
};

export type TolgeeType = ReturnType<typeof Tolgee>;
