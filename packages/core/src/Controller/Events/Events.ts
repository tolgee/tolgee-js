import { EventEmitter } from './EventEmitter';
import {
  CacheEvent,
  FetchingEvent,
  InitialLoadEvent,
  LanguageEvent,
  LoadingEvent,
  PendingLanguageEvent,
  PermanentChangeEvent,
  RunningEvent,
  TolgeeOn,
  UpdateEvent,
  ErrorEvent,
} from '../../types';
import { EventEmitterCombined } from './EventEmitterCombined';

export function Events() {
  let emitterActive = true;

  function isActive() {
    return emitterActive;
  }

  const self = Object.freeze({
    onPendingLanguageChange: EventEmitter<PendingLanguageEvent>(
      'pendingLanguage',
      isActive
    ),
    onLanguageChange: EventEmitter<LanguageEvent>('language', isActive),
    onLoadingChange: EventEmitter<LoadingEvent>('loading', isActive),
    onFetchingChange: EventEmitter<FetchingEvent>('fetching', isActive),
    onInitialLoaded: EventEmitter<InitialLoadEvent>('initialLoad', isActive),
    onRunningChange: EventEmitter<RunningEvent>('running', isActive),
    onCacheChange: EventEmitter<CacheEvent>('cache', isActive),
    onPermanentChange: EventEmitter<PermanentChangeEvent>(
      'permanentChange',
      isActive
    ),
    onError: EventEmitter<ErrorEvent>('error', isActive),
    onUpdate: EventEmitterCombined<UpdateEvent>(isActive),
    setEmitterActive(active: boolean) {
      emitterActive = active;
    },
    on: ((event, handler): any => {
      switch (event) {
        case 'pendingLanguage':
          return self.onPendingLanguageChange.listen(handler as any);
        case 'language':
          return self.onLanguageChange.listen(handler as any);
        case 'loading':
          return self.onLoadingChange.listen(handler as any);
        case 'fetching':
          return self.onFetchingChange.listen(handler as any);
        case 'initialLoad':
          return self.onInitialLoaded.listen(handler as any);
        case 'running':
          return self.onRunningChange.listen(handler as any);
        case 'cache':
          return self.onCacheChange.listen(handler as any);
        case 'update':
          return self.onUpdate.listen(handler as any);
        case 'permanentChange':
          return self.onPermanentChange.listen(handler as any);
        case 'error':
          return self.onError.listen(handler as any);
      }
    }) as TolgeeOn,
  });

  self.onInitialLoaded.listen((e) => self.onUpdate.emit(e, false));
  self.onLanguageChange.listen((e) => self.onUpdate.emit(e, false));
  self.onCacheChange.listen((e) => self.onUpdate.emit(e, true));

  return self;
}

export type EventsInstance = ReturnType<typeof Events>;
