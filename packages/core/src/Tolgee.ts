import { Controller } from './Controller/Controller';
import {
  TolgeeOptions,
  TolgeeInstance,
  TolgeePlugin,
  ObserverOptions,
  DevCredentials,
} from './types';

export const Tolgee = (options?: Partial<TolgeeOptions>): TolgeeInstance => {
  const prepared = false;
  const controller = Controller({
    options,
  });

  // restarts tolgee while applying callback
  const withRestart = (callback: () => void) => {
    const wasRunning = controller.isRunning();
    wasRunning && controller.stop();
    callback();
    wasRunning && controller.run();
  };

  function withPrepare<T extends (...args: any[]) => any>(value: T) {
    if (prepared) {
      return value;
    }
    return ((...args: any[]) => {
      controller.prepare();
      return value(...args);
    }) as T;
  }

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
    loadRecords: withPrepare(controller.loadRecords),
    loadRecord: withPrepare(controller.loadRecord),
    addStaticData: controller.addStaticData,
    getRecord: controller.getRecord,
    getAllRecords: controller.getAllRecords,
    isLoaded: controller.isLoaded,
    isInitialLoading: controller.isInitialLoading,
    isLoading: controller.isLoading,
    isFetching: controller.isFetching,
    isRunning: controller.isRunning,
    run: withPrepare(controller.run),
    stop: controller.stop,
    t: withPrepare(controller.t),
    highlight: controller.highlight,
    getInitialOptions: controller.getInitialOptions,
    isDev: controller.isDev,
    wrap: controller.wrap,
    unwrap: controller.unwrap,
    overrideCredentials(credentials: DevCredentials) {
      withRestart(() => controller.overrideCredentials(credentials));
    },
    // plugins
    setObserverOptions: (options: Partial<ObserverOptions>) => {
      controller.setObserverOptions(options);
      return tolgee;
    },
    use: (plugin: TolgeePlugin | undefined) => {
      if (plugin) {
        withRestart(() => controller.addPlugin(tolgee, plugin));
      }
      return tolgee;
    },
    init: (options?: Partial<TolgeeOptions>) => {
      if (options) {
        withRestart(() => controller.init(options));
      }
      return tolgee;
    },
  });

  return tolgee;
};
