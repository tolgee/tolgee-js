import {Lifecycle, scoped} from 'tsyringe';
import {TextInputHandler} from './AbstractTextInputHandler';
import {PolygloatService} from "../services/polygloatService";
import {TranslationHighlighter} from "../TranslationHighlighter";
import {Properties} from "../Properties";

@scoped(Lifecycle.ContainerScoped)
export class InputHandler extends TextInputHandler {
    constructor(service: PolygloatService, highlighter: TranslationHighlighter, properties: Properties) {
        super(service, highlighter, properties);
    }

    protected getValue(node) {
        return node.value;
    }

    protected setValue(node, value) {
        return node.value = value;
    }
}
