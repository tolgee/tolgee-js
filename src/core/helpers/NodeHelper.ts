import {ArgumentTypes} from "./commonTypes";

export class NodeHelper {
    private static* evaluateGenerator<T extends Node>(expression: string, targetNode: Node): Generator<T> {
        let node: Node;
        const evaluated = document.evaluate(expression, targetNode, undefined, XPathResult.ANY_TYPE);
        while ((node = evaluated.iterateNext()) !== null) {
            yield node as T;
        }
    }

    static evaluate<T extends Node>(...args: ArgumentTypes<typeof NodeHelper.evaluateGenerator>): T[] {
        return Array.from(this.evaluateGenerator(...args)) as T[];
    }

    static evaluateToSingle<T extends Node>(...args: ArgumentTypes<typeof NodeHelper.evaluateGenerator>): T {
        const arr = this.evaluate<T>(...args);
        if (arr.length === 1) {
            return arr[0];
        }
        if (arr.length < 1) {
            throw new Error("No element found");
        }
        throw new Error("Multiple elements found");
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
        if ((node as Attr).ownerElement) {
            return (node as Attr).ownerElement;
        }
    }

}
