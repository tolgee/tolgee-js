import {PolygloatService} from '../services/polygloatService';
import {container} from 'tsyringe';
import {TranslationHighlighter} from '../TranslationHighlighter';
import {PolygloatTextAreaElement, PolygloatTextInputElement} from '../Types';
import {Properties} from "../Properties";

export abstract class TextInputHandler {
    private service = container.resolve(PolygloatService);
    private highlighter = container.resolve(TranslationHighlighter);
    private properties = container.resolve(Properties);

    async refresh(node: Element) {
        let textArea: PolygloatTextAreaElement = node as PolygloatTextAreaElement;
        if (!textArea.__polygloat.touched) {
            let {newValue} = await this.replace(textArea.__polygloat.oldValue);
            this.setValue(node as HTMLElement, newValue);
        }

        //todo: allow all attributes
        let {newValue: newPlaceholder}
            = await this.replace(textArea.__polygloat.oldPlaceholder);
        node.setAttribute('placeholder', newPlaceholder);
    }

    async handleNewNode(node: Element): Promise<void> {

        if (node.getAttribute('_polygloat') === null) {
            //todo: make node handling fully synchronous to avoid multiple handling of the same node
            node.setAttribute('_polygloat', '');

            let {inputs: valueInputs, oldValue, newValue} = await this.replace(this.getValue(node as HTMLElement));
            this.setValue(node as HTMLElement, newValue);

            let {inputs: placeholderInputs, oldValue: oldPlaceholder, newValue: newPlaceholder}
                = await this.replace(node.getAttribute('placeholder'));
            node.setAttribute('placeholder', newPlaceholder);

            this.addPolygloatToPrototype(node);

            let textInputElement: PolygloatTextInputElement = node as PolygloatTextInputElement;
            textInputElement.__polygloat = {
                ...textInputElement.__polygloat,
                oldValue,
                valueInputs,
                oldPlaceholder,
                placeholderInputs,
                touched: !!textInputElement.__polygloat.touched
            };

            if (this.properties.config.mode == "development") {
                this.highlighter.listen(node);
            }
        }
    }

    async replace(oldValue: string): Promise<{ inputs: string[], newValue: string, oldValue: string }> {
        let inputs;
        let newValue;

        if (oldValue !== null) {
            let replaceData = await this.service.replace(oldValue);
            inputs = replaceData.inputs;
            oldValue = replaceData.oldValue;
            newValue = replaceData.newValue;
        }
        return {inputs, newValue, oldValue};
    }

    protected abstract setValue(node: HTMLElement, value): void;

    protected abstract getValue(node: HTMLElement): string;


    private addPolygloatToPrototype(element: Element) {
        let spanPrototype = Object.getPrototypeOf(element);
        spanPrototype.__polygloat = {};
    }
}
