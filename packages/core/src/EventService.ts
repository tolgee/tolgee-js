import { EventEmitter } from './EventEmitter';
import { EventEmitterSelective } from './EventEmitterSelective';
import { ListenerHandler, TolgeeOn } from './types';

export const EventService = () => {
  const onPendingLanguageChange = EventEmitter<string>();
  const onLanguageChange = EventEmitter<string>();
  const onKeyChange = EventEmitter<string>();
  const onFetchingChange = EventEmitter<boolean>();
  const onInitialLoaded = EventEmitter<void>();
  const onKeyUpdate = EventEmitterSelective<void>();

  onInitialLoaded.listen(() => onKeyUpdate.emit());
  onLanguageChange.listen(() => onKeyUpdate.emit());
  onKeyChange.listen((key) => onKeyUpdate.emit(undefined, key));

  const on: TolgeeOn = (event, handler): any => {
    switch (event) {
      case 'pendingLanguage':
        return onPendingLanguageChange.listen(
          handler as ListenerHandler<string>
        );
      case 'language':
        return onLanguageChange.listen(handler as ListenerHandler<string>);
      case 'key':
        return onKeyChange.listen(handler as ListenerHandler<string>);
      case 'fetching':
        return onFetchingChange.listen(handler as ListenerHandler<boolean>);
      case 'initialLoad':
        return onInitialLoaded.listen(handler as ListenerHandler<void>);
      case 'keyUpdate':
        return onKeyUpdate.listen(handler as ListenerHandler<void>);
    }
  };

  return Object.freeze({
    onPendingLanguageChange,
    onLanguageChange,
    onKeyChange,
    onKeyUpdate,
    onFetchingChange,
    onInitialLoaded,
    on,
  });
};

export type EventServiceType = ReturnType<typeof EventService>;
