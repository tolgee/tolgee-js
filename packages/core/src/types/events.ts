import type { CacheDescriptorWithKey } from './cache';
import { TolgeeError } from './errors';

export type Subscription = {
  unsubscribe: () => void;
};

export type ListenerEvent<E extends string, T> = { type: E; value: T };
export type Handler<E extends ListenerEvent<string, any>> = (e: E) => void;
export type CombinedHandler<E extends ListenerEvent<string, any>> = (
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
  (event: 'update', handler: CombinedHandler<UpdateEvent>): Subscription;

  /**
   * Emitted on language change.
   */
  (event: 'language', handler: Handler<LanguageEvent>): Subscription;

  /**
   * Emitted on pendingLanguage change.
   */
  (
    event: 'pendingLanguage',
    handler: Handler<PendingLanguageEvent>
  ): Subscription;

  /**
   * Emitted on loading change. Changes when tolgee is loading some data for the first time.
   */
  (event: 'loading', handler: Handler<LoadingEvent>): Subscription;

  /**
   * Emitted on fetching change. Changes when tolgee is fetching any data.
   */
  (event: 'fetching', handler: Handler<FetchingEvent>): Subscription;

  /**
   * Emitted when `tolgee.run` method finishes.
   */
  (event: 'initialLoad', handler: Handler<InitialLoadEvent>): Subscription;

  /**
   * Emitted when internal `running` state changes.
   */
  (event: 'running', handler: Handler<RunningEvent>): Subscription;

  /**
   * Emitted when cache changes.
   */
  (event: 'cache', handler: Handler<CacheEvent>): Subscription;

  /**
   * Emitted on errors
   */
  (event: 'error', handler: Handler<ErrorEvent>): Subscription;

  /**
   * Translation was changed or created via dev tools
   */
  (
    event: 'permanentChange',
    handler: Handler<PermanentChangeEvent>
  ): Subscription;

  (event: E, handler: unknown): Subscription;
};

export type TranslationDescriptor = {
  key: string;
  namespace: string | undefined;
};
