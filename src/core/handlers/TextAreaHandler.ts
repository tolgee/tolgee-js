import {Lifecycle, scoped} from 'tsyringe';
import {TextInputHandler} from './AbstractTextInputHandler';
import {PolygloatService} from "../services/polygloatService";
import {TranslationHighlighter} from "../TranslationHighlighter";
import {Properties} from "../Properties";

@scoped(Lifecycle.ContainerScoped)
export class TextAreaHandler extends TextInputHandler {
    constructor(service: PolygloatService, highlighter: TranslationHighlighter, properties: Properties) {
        super(service, highlighter, properties);
    }

    protected getValue(node) {
        return node.innerHTML;
    }

    protected setValue(node, value) {
        node.innerHTML = value;
    }
}
