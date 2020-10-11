import {injectable} from 'tsyringe';
import {TextInputHandler} from './AbstractTextInputHandler';

@injectable()
export class InputHandler extends TextInputHandler {
    protected getValue(node) {
        return node.value;
    }

    protected setValue(node, value) {
        return node.value = value;
    }
}
