import { EventEmitter } from './EventEmitter';
import { EventEmitterSelective } from './EventEmitterSelective';
import { CacheDescriptorWithKey, TolgeeOn } from '../../types';

export const Events = (
  getFallbackNs: () => string[],
  getDefaultNs: () => string
) => {
  const onPendingLanguageChange = EventEmitter<string>();
  const onLanguageChange = EventEmitter<string>();
  const onLoadingChange = EventEmitter<boolean>();
  const onFetchingChange = EventEmitter<boolean>();
  const onInitialLoaded = EventEmitter<void>();
  const onRunningChange = EventEmitter<boolean>();
  const onCacheChange = EventEmitter<CacheDescriptorWithKey>();
  const onNsUpdate = EventEmitterSelective(getFallbackNs, getDefaultNs);

  onInitialLoaded.listen(() => onNsUpdate.emit());
  onLanguageChange.listen(() => onNsUpdate.emit());
  onCacheChange.listen(({ value }) => {
    onNsUpdate.emit([value.namespace], true);
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
        return onNsUpdate.listen(handler as any);
    }
  };

  return Object.freeze({
    onPendingLanguageChange,
    onLanguageChange,
    onLoadingChange,
    onFetchingChange,
    onInitialLoaded,
    onRunningChange,
    onCacheChange,
    onNsUpdate,
    on,
  });
};

export type EventsInstance = ReturnType<typeof Events>;
