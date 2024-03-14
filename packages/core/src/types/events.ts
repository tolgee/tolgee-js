import type { NsFallback } from './general';
import type { CacheDescriptorWithKey } from './cache';
import { TolgeeError } from './errors';

export type Subscription = {
  unsubscribe: () => void;
};

export type SubscriptionSelective = {
  unsubscribe: () => void;
  /**
   * Subscribes to namespace(s)
   * @param ns - namespace(s), if empty default namespace is used
   *
   * Can be used multiple times to subscribe for more.
   */
  subscribeNs(ns?: NsFallback): SubscriptionSelective;
};

export type ListenerEvent<T> = { value: T };
export type Listener<T> = (e: ListenerEvent<T>) => void;

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
  (event: 'update', handler: Listener<void>): Subscription;

  /**
   * Emitted on language change.
   */
  (event: 'language', handler: Listener<string>): Subscription;

  /**
   * Emitted on pendingLanguage change.
   */
  (event: 'pendingLanguage', handler: Listener<string>): Subscription;

  /**
   * Emitted on loading change. Changes when tolgee is loading some data for the first time.
   */
  (event: 'loading', handler: Listener<boolean>): Subscription;

  /**
   * Emitted on fetching change. Changes when tolgee is fetching any data.
   */
  (event: 'fetching', handler: Listener<boolean>): Subscription;

  /**
   * Emitted when `tolgee.run` method finishes.
   */
  (event: 'initialLoad', handler: Listener<void>): Subscription;

  /**
   * Emitted when internal `running` state changes.
   */
  (event: 'running', handler: Listener<boolean>): Subscription;

  /**
   * Emitted when cache changes.
   */
  (event: 'cache', handler: Listener<CacheDescriptorWithKey>): Subscription;

  /**
   * Emitted on errors
   */
  (event: 'error', handler: Listener<TolgeeError>): Subscription;

  /**
   * Translation was changed or created via dev tools
   */
  (
    event: 'permanentChange',
    handler: Listener<CacheDescriptorWithKey>
  ): Subscription;

  (event: E, handler: unknown): Subscription;
};

export type TranslationDescriptor = {
  key: string;
  namespace: string | undefined;
};
