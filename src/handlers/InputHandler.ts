import {Lifecycle, scoped} from 'tsyringe';
import {TextInputHandler} from './AbstractTextInputHandler';

@scoped(Lifecycle.ContainerScoped)
export class InputHandler extends TextInputHandler {
    protected getValue(node) {
        return node.value;
    }

    protected setValue(node, value) {
        return node.value = value;
    }
}
