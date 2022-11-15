import { CacheDescriptorWithKey, Subscription, Listener } from '../types';

export type TolgeeEvent =
  | 'pendingLanguage'
  | 'language'
  | 'key'
  | 'loading'
  | 'fetching'
  | 'initialLoad'
  | 'running'
  | 'cache'
  | 'update';

export interface EventType {
  pendingLanguage: string;
  language: string;
  key: string;
  loading: boolean;
  fetching: boolean;
  initialLoad: void;
  running: boolean;
  cache: CacheDescriptorWithKey;
  update: void;
}

export type TolgeeOn<E extends keyof EventType = keyof EventType> = (
  event: E,
  handler: Listener<[EventType[E]]>
) => Subscription;
