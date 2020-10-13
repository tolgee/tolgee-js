import {Lifecycle, scoped} from 'tsyringe';
import {EventEmitter} from "./EventEmitter";
import {TranslationData} from "../DTOs/TranslationData";

@scoped(Lifecycle.ContainerScoped)
export class EventService {
    public readonly TRANSLATION_CHANGED = new EventEmitter<TranslationData>();
    public readonly LANGUAGE_CHANGED = new EventEmitter<string>();
}