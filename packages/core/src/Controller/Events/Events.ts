import { EventEmitter } from './EventEmitter';
import { EventEmitterSelective } from './EventEmitterSelective';
import { CacheDescriptorWithKey, TolgeeOn } from '../../types';

export const Events = (
  getFallbackNs: () => string[],
  getDefaultNs: () => string
) => {
  let emitterActive = true;

  function isActive() {
    return emitterActive;
  }

  const onPendingLanguageChange = EventEmitter<string>(isActive);
  const onLanguageChange = EventEmitter<string>(isActive);
  const onLoadingChange = EventEmitter<boolean>(isActive);
  const onFetchingChange = EventEmitter<boolean>(isActive);
  const onInitialLoaded = EventEmitter<void>(isActive);
  const onRunningChange = EventEmitter<boolean>(isActive);
  const onCacheChange = EventEmitter<CacheDescriptorWithKey>(isActive);
  const onUpdate = EventEmitterSelective(isActive, getFallbackNs, getDefaultNs);

  onInitialLoaded.listen(() => onUpdate.emit());
  onLanguageChange.listen(() => onUpdate.emit());
  onCacheChange.listen(({ value }) => {
    onUpdate.emit([value.namespace], true);
  });

  const on: TolgeeOn = (event, handler): any => {
    switch (event) {
      case 'pendingLanguage':
        return onPendingLanguageChange.listen(handler as any);
      case 'language':
        return onLanguageChange.listen(handler as any);
      case 'loading':
        return onLoadingChange.listen(handler as any);
      case 'fetching':
        return onFetchingChange.listen(handler as any);
      case 'initialLoad':
        return onInitialLoaded.listen(handler as any);
      case 'running':
        return onRunningChange.listen(handler as any);
      case 'cache':
        return onCacheChange.listen(handler as any);
      case 'update':
        return onUpdate.listen(handler as any);
    }
  };

  function setEmmiterActive(active: boolean) {
    emitterActive = active;
  }

  return Object.freeze({
    onPendingLanguageChange,
    onLanguageChange,
    onLoadingChange,
    onFetchingChange,
    onInitialLoaded,
    onRunningChange,
    onCacheChange,
    onUpdate,
    setEmmiterActive,
    on,
  });
};

export type EventsInstance = ReturnType<typeof Events>;
