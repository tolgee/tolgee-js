import {
  CacheDescriptor,
  CachePublicRecord,
  ChangeTranslationInterface,
  FallbackNsTranslation,
  HighlightInterface,
  ListenerHandler,
  ListenerSelective,
  ObserverOptions,
  TFnType,
  TolgeeOptions,
  TolgeeStaticData,
  TranslatePropsInternal,
  TranslationsFlat,
  Unwrapped,
} from '../types';
import { TolgeePlugin } from './plugin';
import { TolgeeOn } from './event';

export type TolgeeInstance = Readonly<{
  /**
   * Listen to tolgee events.
   */
  on: TolgeeOn;

  /**
   * Listen for specific keys/namespaces changes.
   */
  onKeyUpdate: (handler: ListenerHandler<void>) => ListenerSelective;

  /**
   * Add tolgee plugin.
   */
  use: (plugin: TolgeePlugin | undefined) => TolgeeInstance;

  /**
   * @return current language if set.
   */
  getLanguage: () => string | undefined;

  /**
   * `pendingLanguage` represents language which is currently being loaded.
   * @return current `pendingLanguage` if set.
   */
  getPendingLanguage: () => string | undefined;

  /**
   * Change current language.
   * - if not running sets `pendingLanguage`, `language` to the new value
   * - if running sets `pendingLanguage` to the value, fetches necessary data and then changes `language`
   *
   * @return Promise which is resolved when `language` is changed.
   */
  changeLanguage: (language: string) => Promise<void>;

  /**
   * Temporarily change translation in cache.
   * @return object with revert method.
   */
  changeTranslation: ChangeTranslationInterface;

  /**
   * Adds namespace(s) list of active namespaces. And if tolgee is running, loads required data.
   */
  addActiveNs: (ns: FallbackNsTranslation, forget?: boolean) => Promise<void>;

  /**
   * Remove namespace(s) from active namespaces.
   *
   * Tolgee internally counts how many times was each active namespace added,
   * so this method will remove namespace only if the counter goes down to 0.
   */
  removeActiveNs: (ns: FallbackNsTranslation) => void;

  /**
   * Manually load record from `Backend` (or `DevBackend` when in dev mode)
   */
  loadRecord: (descriptors: CacheDescriptor) => Promise<TranslationsFlat>;

  /**
   * Manually load multiple records from `Backend` (or `DevBackend` when in dev mode)
   *
   * It loads data together and adds them to cache in one operation, to prevent partly loaded state.
   */
  loadRecords: (descriptors: CacheDescriptor[]) => Promise<TranslationsFlat[]>;

  /**
   *
   */
  addStaticData: (data: TolgeeStaticData) => void;

  /**
   * Get record from cache.
   */
  getRecord: (descriptor: CacheDescriptor) => TranslationsFlat | undefined;

  /**
   * Get all records from cache.
   */
  getAllRecords: () => CachePublicRecord[];

  /**
   * @return `true` if tolgee is loading initial data (triggered by `run`).
   */
  isInitialLoading: () => boolean;

  /**
   * @param ns optional list of namespaces that you are interested in
   * @return `true` if tolgee is loading some translations for the first time.
   */
  isLoading: (ns?: FallbackNsTranslation) => boolean;

  /**
   * @param ns optional list of namespaces that you are interested in
   * @return `true` if there are data that need to be fetched.
   */
  isLoaded: (ns?: FallbackNsTranslation) => boolean;

  /**
   * @param ns optional list of namespaces that you are interested in
   * @return `true` if tolgee is fetching some translations.
   */
  isFetching: (ns?: FallbackNsTranslation) => boolean;

  /**
   * @return `true` if tolgee is running.
   */
  isRunning: () => boolean;

  /**
   * Highlight keys that match selection.
   */
  highlight: HighlightInterface;

  /**
   * @return current Tolgee options.
   */
  getInitialOptions: () => TolgeeOptions;

  /**
   * Tolgee is in dev mode if `DevTools` plugin is used and `apiKey` + `apiUrl` are specified.
   * @return `true` if tolgee is in dev mode.
   */
  isDev: () => boolean;

  /**
   * Updates options after instance creation. Extends existing options,
   * so it only changes the fields, that are listed.
   *
   * When called in running state, tolgee stops and runs again.
   */
  init: (options: Partial<TolgeeOptions>) => TolgeeInstance;

  /**
   * Changes internal state to running: true and loads initial files.
   * Runs runnable plugins mainly Observer if present.
   */
  run: () => Promise<void>;

  /**
   * Changes internal state to running: false and stops runnable plugins.
   */
  stop: () => void;

  /**
   * Returns translated and formatted key.
   * If Observer is present and tolgee is running, wraps result to be identifiable in the DOM.
   */
  t: TFnType;

  /**
   * Wraps translation if there is `Observer` plugin
   */
  wrap: (params: TranslatePropsInternal) => string | undefined;

  /**
   * Unwrap translation
   */
  unwrap: (text: string) => Unwrapped;

  /**
   * Options which will be passed to observer
   */
  setObserverOptions: (options: Partial<ObserverOptions>) => TolgeeInstance;
}>;
