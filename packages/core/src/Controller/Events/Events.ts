import { EventEmitter } from './EventEmitter';
import { EventEmitterSelective } from './EventEmitterSelective';
import {
  CacheDescriptorWithKey,
  TolgeeError,
  TolgeeOn,
  TranslationDescriptor,
} from '../../types';

export function Events(
  getFallbackNs: () => string[],
  getDefaultNs: () => string
) {
  let emitterActive = true;

  function isActive() {
    return emitterActive;
  }

  const self = Object.freeze({
    onPendingLanguageChange: EventEmitter<string>(isActive),
    onLanguageChange: EventEmitter<string>(isActive),
    onLoadingChange: EventEmitter<boolean>(isActive),
    onFetchingChange: EventEmitter<boolean>(isActive),
    onInitialLoaded: EventEmitter<void>(isActive),
    onRunningChange: EventEmitter<boolean>(isActive),
    onCacheChange: EventEmitter<CacheDescriptorWithKey>(isActive),
    onUpdate: EventEmitterSelective(isActive, getFallbackNs, getDefaultNs),
    onPermanentChange: EventEmitter<TranslationDescriptor>(isActive),
    onError: EventEmitter<TolgeeError>(isActive),
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

  self.onInitialLoaded.listen(() => self.onUpdate.emit());
  self.onLanguageChange.listen(() => self.onUpdate.emit());
  self.onCacheChange.listen(({ value }) =>
    self.onUpdate.emit([value.namespace], true)
  );

  return self;
}

export type EventsInstance = ReturnType<typeof Events>;
