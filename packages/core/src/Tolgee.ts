import { Events } from './Events/Events';
import { Controller } from './Controller/Controller';
import { Options, TolgeeInstance, TolgeePlugin } from './types';

export const Tolgee = (options?: Partial<Options>): TolgeeInstance => {
  const events = Events();
  const controller = Controller({
    events,
    options,
  });

  const pluginTools = Object.freeze({
    setFinalFormatter: controller.setFinalFormatter,
    addFormatter: controller.addFormatter,
    setObserver: controller.setObserver,
    getObserver: controller.getObserver,
    setUi: controller.setUi,
    getUi: controller.getUi,
    setDevBackend: controller.setDevBackend,
    addBackend: controller.addBackend,
    setLanguageDetector: controller.setLanguageDetector,
    setLanguageStorage: controller.setLanguageStorage,
  });

  const withRestart = (callback: () => void) => {
    const wasRunning = controller.isRunning();
    wasRunning && controller.stop();
    callback();
    wasRunning && controller.run();
  };

  const tolgee: TolgeeInstance = Object.freeze({
    // event listeners
    on: events.on,
    onKeyUpdate: events.onKeyUpdate.listenSome,

    // state
    getLanguage: controller.getLanguage,
    getPendingLanguage: controller.getPendingLanguage,
    changeLanguage: controller.changeLanguage,
    changeTranslation: controller.changeTranslation,
    addActiveNs: controller.addActiveNs,
    removeActiveNs: controller.removeActiveNs,
    loadRecords: controller.loadRecords,
    loadRecord: controller.loadRecord,
    addStaticData: controller.addStaticData,
    getRecord: controller.getRecord,
    getAllRecords: controller.getAllRecords,
    isLoaded: controller.isLoaded,
    isInitialLoading: controller.isInitialLoading,
    isLoading: controller.isLoading,
    isFetching: controller.isFetching,
    isRunning: controller.isRunning,
    run: controller.run,
    stop: controller.stop,
    t: controller.t,
    highlight: controller.highlight,
    getInitialOptions: controller.getInitialOptions,
    isDev: controller.isDev,
    wrap: controller.wrap,
    unwrap: controller.unwrap,

    // plugins
    use: (plugin: TolgeePlugin | undefined) => {
      if (plugin) {
        withRestart(() => plugin(tolgee, pluginTools));
      }
      return tolgee;
    },
    init: (options: Partial<Options>) => {
      withRestart(() => controller.init(options));
      return tolgee;
    },
  });

  return tolgee;
};
