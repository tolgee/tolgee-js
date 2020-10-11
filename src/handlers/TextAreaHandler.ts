import {injectable} from 'tsyringe';
import {TextInputHandler} from './AbstractTextInputHandler';

@injectable()
export class TextAreaHandler extends TextInputHandler {
    protected getValue(node) {
        return node.innerHTML;
    }

    protected setValue(node, value) {
        node.innerHTML = value;
    }
}
