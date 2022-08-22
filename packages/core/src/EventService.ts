import { EventEmitter } from './EventEmitter';
import { EventEmitterSelective } from './EventEmitterSelective';

export const EventService = () => {
  const onPendingLanguageChange = EventEmitter<string>();
  const onLanguageChange = EventEmitter<string>();
  const onKeyChange = EventEmitter<string>();
  const onKeyUpdate = EventEmitterSelective<{
    type: 'language' | 'key';
  }>();

  onLanguageChange.listen(() => onKeyUpdate.emit({ type: 'language' }));
  onKeyChange.listen((key) => onKeyUpdate.emit({ type: 'key' }, key));

  return Object.freeze({
    onPendingLanguageChange,
    onLanguageChange,
    onKeyChange,
    onKeyUpdate,
  });
};

export type EventServiceType = ReturnType<typeof EventService>;
