import { Controller } from './Controller/Controller';
import { combineOptions } from './Controller/State/initState';
import { TolgeeOptions, TolgeePlugin, DevCredentials } from './types';

const createTolgee = (options: TolgeeOptions) => {
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

  const tolgee = Object.freeze({
    /**
     * Listen to tolgee events.
     */
    on: controller.on,

    /**
     * Listen for specific namespaces changes.
     *
     * ```
     * const sub = tolgee.onUpdate(handler)
     *
     * // subscribe to selected namespace
     * sub.subscribeNs(['common'])
     *
     * // unsubscribe
     * sub.unsubscribe()
     * ```
     */
    onNsUpdate: controller.onUpdate.listenSome,

    /**
     * Turn off/on events emitting. Is on by default.
     */
    setEmmiterActive: controller.setEmmiterActive,

    /**
     * @return current language if set.
     */
    getLanguage: controller.getLanguage,

    /**
     * `pendingLanguage` represents language which is currently being loaded.
     * @return current `pendingLanguage` if set.
     */
    getPendingLanguage: controller.getPendingLanguage,

    /**
     * Change current language.
     * - if not running sets `pendingLanguage`, `language` to the new value
     * - if running sets `pendingLanguage` to the value, fetches necessary data and then changes `language`
     *
     * @return Promise which is resolved when `language` is changed.
     */
    changeLanguage: controller.changeLanguage,

    /**
     * Temporarily change translation in cache.
     * @return object with revert method.
     */
    changeTranslation: controller.changeTranslation,

    /**
     * Adds namespace(s) list of active namespaces. And if tolgee is running, loads required data.
     */
    addActiveNs: controller.addActiveNs,

    /**
     * Remove namespace(s) from active namespaces.
     *
     * Tolgee internally counts how many times was each active namespace added,
     * so this method will remove namespace only if the counter goes down to 0.
     */
    removeActiveNs: controller.removeActiveNs,

    /**
     * Manually load multiple records from `Backend` (or `DevBackend` when in dev mode)
     *
     * It loads data together and adds them to cache in one operation, to prevent partly loaded state.
     */
    loadRecords: controller.loadRecords,

    /**
     * Manually load record from `Backend` (or `DevBackend` when in dev mode)
     */
    loadRecord: controller.loadRecord,

    /**
     *
     */
    addStaticData: controller.addStaticData,

    /**
     * Get record from cache.
     */
    getRecord: controller.getRecord,

    /**
     * Get all records from cache.
     */
    getAllRecords: controller.getAllRecords,

    /**
     * @param ns optional list of namespaces that you are interested in
     * @return `true` if there are data that need to be fetched.
     */
    isLoaded: controller.isLoaded,

    /**
     * @return `true` if tolgee is loading initial data (triggered by `run`).
     */
    isInitialLoading: controller.isInitialLoading,

    /**
     * @param ns optional list of namespaces that you are interested in
     * @return `true` if tolgee is loading some translations for the first time.
     */
    isLoading: controller.isLoading,

    /**
     * @param ns optional list of namespaces that you are interested in
     * @return `true` if tolgee is fetching some translations.
     */
    isFetching: controller.isFetching,

    /**
     * @return `true` if tolgee is running.
     */
    isRunning: controller.isRunning,

    /**
     * Changes internal state to running: true and loads initial files.
     * Runs runnable plugins mainly Observer if present.
     */
    run: controller.run,

    /**
     * Changes internal state to running: false and stops runnable plugins.
     */
    stop: controller.stop,

    /**
     * Returns translated and formatted key.
     * If Observer is present and tolgee is running, wraps result to be identifiable in the DOM.
     */
    t: controller.t,

    /**
     * Highlight keys that match selection.
     */
    highlight: controller.highlight,

    /**
     * @return current Tolgee options.
     */
    getInitialOptions: controller.getInitialOptions,

    /**
     * Tolgee is in dev mode if `DevTools` plugin is used and `apiKey` + `apiUrl` are specified.
     * @return `true` if tolgee is in dev mode.
     */
    isDev: controller.isDev,

    /**
     * Wraps translation if there is `Observer` plugin
     */
    wrap: controller.wrap,

    /**
     * Unwrap translation
     */
    unwrap: controller.unwrap,

    /**
     * Override creadentials passed on initialization.
     *
     * When called in running state, tolgee stops and runs again.
     */
    overrideCredentials(credentials: DevCredentials) {
      withRestart(() => controller.overrideCredentials(credentials));
    },

    /**
     * Add tolgee plugin after initialization.
     *
     * When called in running state, tolgee stops and runs again.
     */
    addPlugin(plugin: TolgeePlugin | undefined) {
      if (plugin) {
        withRestart(() => controller.addPlugin(tolgee, plugin));
      }
    },

    /**
     * Updates options after instance creation. Extends existing options,
     * so it only changes the fields, that are listed.
     *
     * When called in running state, tolgee stops and runs again.
     */
    updateOptions(options?: TolgeeOptions) {
      if (options) {
        withRestart(() => controller.init(options));
      }
    },
  });

  return tolgee;
};

export type TolgeeInstance = ReturnType<typeof createTolgee>;

export type TolgeeChainer = {
  /**
   * Add plugin, plugins are applied when `init` method is called.
   */
  use: (plugin: TolgeePlugin | undefined) => TolgeeChainer;

  /**
   * Update default options before tolgee is initialized.
   */
  updateDefaults: (options: TolgeeOptions) => TolgeeChainer;

  /**
   * Initialize tolgee options and apply plugins
   * @returns tolgee instance
   */
  init(options?: TolgeeOptions): TolgeeInstance;
};

/**
 * Tolgee chainable constructor.
 *
 * Usage:
 * ```
 * const tolgee = Tolgee().use(...).init(...)
 * ```
 */
export const TolgeeCore = (): TolgeeChainer => {
  const state = {
    plugins: [] as (TolgeePlugin | undefined)[],
    options: {} as TolgeeOptions,
  };

  const tolgeeChain = Object.freeze({
    use(plugin: TolgeePlugin | undefined) {
      state.plugins.push(plugin);
      return tolgeeChain;
    },
    updateDefaults(options: TolgeeOptions) {
      state.options = combineOptions(state.options, options);
      return tolgeeChain;
    },
    init(options?: TolgeeOptions) {
      const tolgee = createTolgee(combineOptions(state.options, options));
      state.plugins.forEach(tolgee.addPlugin);
      return tolgee;
    },
  });
  return tolgeeChain;
};
