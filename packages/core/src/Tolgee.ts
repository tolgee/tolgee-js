import { EventService } from './EventService/EventService';
import { StateService } from './StateService/StateService';
import { Options, TolgeeInstance, TolgeePlugin, TranslateProps } from './types';

export const Tolgee = (options?: Partial<Options>): TolgeeInstance => {
  const eventService = EventService();
  const stateService = StateService({
    eventService,
    options,
  });

  const pluginTools = Object.freeze({
    setFinalFormatter: stateService.setFinalFormatter,
    addFormatter: stateService.addFormatter,
    setObserver: stateService.setObserver,
    setUi: stateService.setUi,
    setDevBackend: stateService.setDevBackend,
    addBackend: stateService.addBackend,
  });

  const tolgee: TolgeeInstance = Object.freeze({
    // event listeners
    on: eventService.on,
    onKeyUpdate: eventService.onKeyUpdate.listenSome,

    use: (plugin: TolgeePlugin | undefined) => {
      plugin?.(tolgee, pluginTools);
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
    isLoaded: stateService.isLoaded,
    isInitialLoading: stateService.isInitialLoading,
    isLoading: stateService.isLoading,
    isFetching: stateService.isFetching,
    isRunning: stateService.isRunning,
    init: (options: Partial<Options>) => {
      stateService.init(options);
      return tolgee;
    },

    // other
    run: () => {
      stateService.run();
      return stateService.loadInitial();
    },
    stop: () => {
      stateService.stop();
    },
    t: (props: TranslateProps) => {
      return stateService.t(props);
    },
  });

  return tolgee;
};
