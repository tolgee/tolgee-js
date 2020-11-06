import {ElementWithMeta, NodeMeta, NodeWithMeta} from "../types";
import {POLYGLOAT_ATTRIBUTE_NAME} from "../Constants/Global";

export const createElement = (nodesCount: number, keysCount: number, sameKeys: boolean = false) => {
    const mockedElement = document.createElement("div") as Element as ElementWithMeta;

    let keyNum = 0;

    const cn = (text) => {
        const node = document.createTextNode(text) as Node as NodeWithMeta;
        const keys = [];

        for (let i = 0; i < keysCount; i++) {
            keys.push({key: `key${sameKeys ? `` : ` ${keyNum++}`}`, params: {a: "aaa"}})
        }
        node._polygloat = {
            oldTextContent: `"${text}" before translation.`,
            keys
        } as NodeMeta
        return node;
    }

    const nodes = [];
    for (let i = 0; i < nodesCount; i++) {
        nodes.push(cn(`text ${i}`));
    }
    mockedElement._polygloat = {
        nodes: new Set(nodes)
    }
    mockedElement.append(...nodes);
    mockedElement.setAttribute(POLYGLOAT_ATTRIBUTE_NAME, "");
    return mockedElement;
}