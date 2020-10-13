import {Lifecycle, scoped} from 'tsyringe';
import {TextInputHandler} from './AbstractTextInputHandler';

@scoped(Lifecycle.ContainerScoped)
export class TextAreaHandler extends TextInputHandler {
    protected getValue(node) {
        return node.innerHTML;
    }

    protected setValue(node, value) {
        node.innerHTML = value;
    }
}
