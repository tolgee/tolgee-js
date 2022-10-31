import { Controller } from './Controller/Controller';
import { TolgeeOptions, ObserverOptions } from './types';
import { TolgeeInstance } from './types/TolgeeInstance';
import { TolgeePlugin } from './types/plugin';

export const Tolgee = (options?: Partial<TolgeeOptions>): TolgeeInstance => {
  const controller = Controller({
    options,
  });

  const pluginTools = Object.freeze({
    setFinalFormatter: controller.setFinalFormatter,
    addFormatter: controller.addFormatter,
    setObserver: controller.setObserver,
    hasObserver: controller.hasObserver,
    setUi: controller.setUi,
    hasUi: controller.hasUi,
    setDevBackend: controller.setDevBackend,
    addBackend: controller.addBackend,
    setLanguageDetector: controller.setLanguageDetector,
    setLanguageStorage: controller.setLanguageStorage,
    overrideCredentials: controller.overrideCredentials,
  });

  const withRestart = (callback: () => void) => {
    const wasRunning = controller.isRunning();
    wasRunning && controller.stop();
    callback();
    wasRunning && controller.run();
  };

  const tolgee: TolgeeInstance = Object.freeze({
    // event listeners
    on: controller.on,
    onKeyUpdate: controller.onKeyUpdate.listenSome,

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
    setObserverOptions: (options: Partial<ObserverOptions>) => {
      controller.setObserverOptions(options);
      return tolgee;
    },
    use: (plugin: TolgeePlugin | undefined) => {
      if (plugin) {
        withRestart(() => plugin(tolgee, pluginTools));
      }
      return tolgee;
    },
    init: (options: Partial<TolgeeOptions>) => {
      withRestart(() => controller.init(options));
      return tolgee;
    },
  });

  return tolgee;
};
