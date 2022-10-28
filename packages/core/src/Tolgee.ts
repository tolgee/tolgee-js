import { Controller } from './Controller/Controller';
import {
  TolgeeOptions,
  TolgeeInstance,
  TolgeePlugin,
  ObserverOptions,
  DevCredentials,
} from './types';

export const Tolgee = (options?: Partial<TolgeeOptions>): TolgeeInstance => {
  const controller = Controller({
    options,
  });

  // plugins are added to queue
  // applied on `init` or `run`
  let pluginsQueue: (() => void)[] | undefined = [];

  function addPlugin(tolgee: TolgeeInstance, plugin: TolgeePlugin) {
    if (pluginsQueue) {
      pluginsQueue.push(() => controller.addPlugin(tolgee, plugin));
    } else {
      controller.addPlugin(tolgee, plugin);
    }
  }

  function lazyInitializePlugins() {
    if (pluginsQueue?.length) {
      const queue = pluginsQueue;
      // disable queue, so nested plugins are applied immediately
      pluginsQueue = undefined;
      queue.forEach((initializer) => initializer());
      pluginsQueue = [];
    }
  }

  // plugins initialization
  // applied lazily
  const lazilyPrepare = <T extends (...args: any[]) => any>(func: T): T => {
    return ((...args: any[]) => {
      lazyInitializePlugins();
      return func(...args);
    }) as T;
  };

  // restarts tolgee while applying callback
  const withRestart = (callback: () => void) => {
    const wasRunning = controller.isRunning();
    wasRunning && controller.stop();
    callback();
    wasRunning && lazilyPrepare(controller.run)();
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
    run: lazilyPrepare(controller.run),
    stop: controller.stop,
    t: controller.t,
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
        withRestart(() => addPlugin(tolgee, plugin));
      }
      return tolgee;
    },
    init: lazilyPrepare((options?: Partial<TolgeeOptions>) => {
      if (options) {
        withRestart(() => controller.init(options));
      }
      return tolgee;
    }),
  });

  return tolgee;
};
