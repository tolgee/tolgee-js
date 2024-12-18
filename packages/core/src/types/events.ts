import type { CacheDescriptorWithKey } from './cache';
import { TolgeeError } from './errors';

export type Subscription = {
  unsubscribe: () => void;
};

export type ListenerEvent<E extends string, T> = { type: E; value: T };
export type Listener<E extends ListenerEvent<string, any>> = (e: E) => void;
export type CombinedListener<E extends ListenerEvent<string, any>> = (
  e: E[]
) => void;

export type LanguageEvent = ListenerEvent<'language', string>;
export type PendingLanguageEvent = ListenerEvent<'pendingLanguage', string>;
export type LoadingEvent = ListenerEvent<'loading', boolean>;
export type FetchingEvent = ListenerEvent<'fetching', boolean>;
export type InitialLoadEvent = ListenerEvent<'initialLoad', void>;
export type RunningEvent = ListenerEvent<'running', boolean>;
export type CacheEvent = ListenerEvent<'cache', CacheDescriptorWithKey>;
export type ErrorEvent = ListenerEvent<'error', TolgeeError>;
export type PermanentChangeEvent = ListenerEvent<
  'permanentChange',
  TranslationDescriptor
>;

export type UpdateEvent = LanguageEvent | CacheEvent | InitialLoadEvent;

export type TolgeeEvent =
  | 'language'
  | 'pendingLanguage'
  | 'loading'
  | 'fetching'
  | 'initialLoad'
  | 'running'
  | 'cache'
  | 'update'
  | 'permanentChange';

export interface EventType {
  language: string;
  pendingLanguage: string;
  loading: boolean;
  fetching: boolean;
  initialLoad: void;
  running: boolean;
  cache: CacheDescriptorWithKey;
  update: void;
  error: TolgeeError;
  permanentChange: CacheDescriptorWithKey;
}

export type TolgeeOn<E extends keyof EventType = keyof EventType> = {
  /**
   * Emitted when any key needs (or might need) to be re-rendered.
   * Similar to tolgee.onNsUpdate, except for all namespaces.
   */
  (event: 'update', handler: CombinedListener<UpdateEvent>): Subscription;

  /**
   * Emitted on language change.
   */
  (event: 'language', handler: Listener<LanguageEvent>): Subscription;

  /**
   * Emitted on pendingLanguage change.
   */
  (
    event: 'pendingLanguage',
    handler: Listener<PendingLanguageEvent>
  ): Subscription;

  /**
   * Emitted on loading change. Changes when tolgee is loading some data for the first time.
   */
  (event: 'loading', handler: Listener<LoadingEvent>): Subscription;

  /**
   * Emitted on fetching change. Changes when tolgee is fetching any data.
   */
  (event: 'fetching', handler: Listener<FetchingEvent>): Subscription;

  /**
   * Emitted when `tolgee.run` method finishes.
   */
  (event: 'initialLoad', handler: Listener<InitialLoadEvent>): Subscription;

  /**
   * Emitted when internal `running` state changes.
   */
  (event: 'running', handler: Listener<RunningEvent>): Subscription;

  /**
   * Emitted when cache changes.
   */
  (event: 'cache', handler: Listener<CacheEvent>): Subscription;

  /**
   * Emitted on errors
   */
  (event: 'error', handler: Listener<ErrorEvent>): Subscription;

  /**
   * Translation was changed or created via dev tools
   */
  (
    event: 'permanentChange',
    handler: Listener<PermanentChangeEvent>
  ): Subscription;

  (event: E, handler: unknown): Subscription;
};

export type TranslationDescriptor = {
  key: string;
  namespace: string | undefined;
};
