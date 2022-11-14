import { CacheDescriptorWithKey, Listener, ListenerHandler } from '../types';

export type TolgeeEvent =
  | 'pendingLanguage'
  | 'language'
  | 'key'
  | 'loading'
  | 'fetching'
  | 'initialLoad'
  | 'running'
  | 'cache'
  | 'keyUpdate';

export interface EventType {
  pendingLanguage: string;
  language: string;
  key: string;
  loading: boolean;
  fetching: boolean;
  initialLoad: void;
  running: boolean;
  cache: CacheDescriptorWithKey;
  keyUpdate: void;
}

export type TolgeeOn<E extends keyof EventType = keyof EventType> = (
  event: E,
  handler: ListenerHandler<[EventType[E]]>
) => Listener;
