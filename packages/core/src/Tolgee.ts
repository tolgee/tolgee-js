import { EventService } from './EventService';
import { PluginService } from './PluginService/PluginService';
import { StateService } from './StateService/StateService';
import { Options, TolgeeInstance } from './types';

export const Tolgee = (options?: Options) => {
  const eventService = EventService();
  const stateService = StateService(eventService, options || {});
  const pluginService = PluginService(stateService.getLanguage);

  const tolgee: TolgeeInstance = Object.freeze({
    // event listeners
    onLanguageChange: eventService.onLanguageChange,
    onPendingLanguageChange: eventService.onPendingLanguageChange,
    onFetchingChange: eventService.onFetchingChange,
    onKeyUpdate: eventService.onKeyUpdate,
    onLoad: eventService.onInitialLoaded,

    // plugins
    setWrapper: (
      ...params: Parameters<typeof pluginService.setWrapper>
    ): typeof tolgee => {
      pluginService.setWrapper(...params);
      return tolgee;
    },
    setFormat: (...params: Parameters<typeof pluginService.setFormat>) => {
      pluginService.setFormat(...params);
      return tolgee;
    },
    setObserver: (...params: Parameters<typeof pluginService.setObserver>) => {
      pluginService.setObserver(...params);
      return tolgee;
    },

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
    init: (options: Options) => {
      stateService.init(options);
      return tolgee;
    },

    // other
    run: () => {
      pluginService.run();
      return stateService.loadInitial();
    },
    stop: () => {
      pluginService.stop();
    },
    instant: (key: string, namespace?: string) => {
      const translation = stateService.getTranslation(key, namespace);
      return pluginService.formatTranslation(key, translation);
    },
  });
  return tolgee;
};

export type TolgeeType = ReturnType<typeof Tolgee>;
