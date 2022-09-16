import { EventService } from './EventService/EventService';
import { StateService } from './StateService/StateService';
import { Options, TolgeeInstance, TolgeePlugin } from './types';

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

  const withRestart = (callback: () => void) => {
    const wasRunning = stateService.isRunning();
    wasRunning && stateService.stop();
    callback();
    wasRunning && stateService.run();
  };

  const tolgee: TolgeeInstance = Object.freeze({
    // event listeners
    on: eventService.on,
    onKeyUpdate: eventService.onKeyUpdate.listenSome,

    // state
    getLanguage: stateService.getLanguage,
    getPendingLanguage: stateService.getPendingLanguage,
    changeLanguage: stateService.changeLanguage,
    changeTranslation: stateService.changeTranslation,
    addActiveNs: stateService.addActiveNs,
    removeActiveNs: stateService.removeActiveNs,
    loadRecords: stateService.loadRecords,
    loadRecord: stateService.loadRecord,
    isLoaded: stateService.isLoaded,
    isInitialLoading: stateService.isInitialLoading,
    isLoading: stateService.isLoading,
    isFetching: stateService.isFetching,
    isRunning: stateService.isRunning,
    run: stateService.run,
    stop: stateService.stop,
    t: stateService.t,
    highlight: stateService.highlight,

    // plugins
    use: (plugin: TolgeePlugin | undefined) => {
      if (plugin) {
        withRestart(() => plugin(tolgee, pluginTools));
      }
      return tolgee;
    },
    init: (options: Partial<Options>) => {
      withRestart(() => stateService.init(options));
      return tolgee;
    },
  });

  return tolgee;
};
