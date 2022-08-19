import { EventEmitter, EventEmitterImpl } from './EventEmitter';
import { TranslationData } from '../types/DTOs';
import { ElementWithMeta } from '../types';

export class EventService {
  public readonly TRANSLATION_CHANGED: EventEmitter<TranslationData> =
    new EventEmitterImpl<TranslationData>();
  public readonly LANGUAGE_CHANGED: EventEmitter<string> =
    new EventEmitterImpl<string>();
  public readonly LANGUAGE_LOADED: EventEmitter<string> =
    new EventEmitterImpl<string>();
  public readonly ELEMENT_REGISTERED: EventEmitter<ElementWithMeta> =
    new EventEmitterImpl<ElementWithMeta>();
}
