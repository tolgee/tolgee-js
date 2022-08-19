import { EventEmitter } from './EventEmitter';
import { EventEmitterSelective } from './EventEmitterSelective';

export const EventService = () => {
  const onPendingLanguageChange = EventEmitter<string>();
  const onLanguageChange = EventEmitter<string>();
  const onTranslationChange = EventEmitter<string>();
  const onKeyChange = EventEmitterSelective<{
    type: 'language' | 'translation';
  }>();

  onLanguageChange.listen(() => onKeyChange.emit({ type: 'language' }));
  onTranslationChange.listen((key) =>
    onKeyChange.emit({ type: 'translation' }, key)
  );

  return Object.freeze({
    onPendingLanguageChange,
    onLanguageChange,
    onTranslationChange,
    onKeyChange,
  });
};

export type EventServiceType = ReturnType<typeof EventService>;
