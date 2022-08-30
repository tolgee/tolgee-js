import { EventService } from './EventService';
import { PluginService } from './PluginService/PluginService';
import { StateService } from './StateService/StateService';
import {
  FormatPlugin,
  ObserverPlugin,
  Options,
  TolgeeInstance,
  TranslateProps,
} from './types';

export const Tolgee = (options?: Options): TolgeeInstance => {
  const eventService = EventService();
  const stateService = StateService(eventService, options || {});
  const pluginService = PluginService(stateService.getLanguage, (params) =>
    instant(params)
  );

  const instant = (params: TranslateProps) => {
    const translation = stateService.getTranslation(
      params.key,
      params.namespace
    );
    return pluginService.formatTranslation({ ...params, translation });
  };

  eventService.onLanguageChange.listen(pluginService.retranslate);

  const tolgee: TolgeeInstance = Object.freeze({
    // event listeners
    onLanguageChange: eventService.onLanguageChange,
    onPendingLanguageChange: eventService.onPendingLanguageChange,
    onFetchingChange: eventService.onFetchingChange,
    onKeyUpdate: eventService.onKeyUpdate,
    onLoad: eventService.onInitialLoaded,

    setFormat: (formatter: FormatPlugin | undefined) => {
      pluginService.setFormat(formatter);
      return tolgee;
    },
    setObserver: (observer: ObserverPlugin | undefined) => {
      pluginService.setObserver(observer);
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
      return pluginService.formatTranslation({ key, translation });
    },
  });
  return tolgee;
};
