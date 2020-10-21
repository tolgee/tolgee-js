import {ArgumentTypes} from "./commonTypes";

export class NodeHelper {
    static* evaluate<T extends Node>(expression: string, targetNode: Node): Generator<T> {
        let node: Node;
        const evaluated = document.evaluate(expression, targetNode, undefined, XPathResult.ANY_TYPE);
        while ((node = evaluated.iterateNext()) !== null) {
            yield node as T;
        }
    }

    static evaluateArray<T extends Node>(...args: ArgumentTypes<typeof NodeHelper.evaluate>): T[] {
        return Array.from(this.evaluate(...args)) as T[];
    }

    public static closestElement(node: Element | Text) {
        if (node instanceof Text) {
            return node.parentElement;
        }
        return node;
    }

    static getParentElement(node: Node): Element | undefined {
        if (node.parentElement) {
            return node.parentElement;
        }
        if (node.parentNode.parentElement) {
            return node.parentNode.parentElement;
        }
    }
}
