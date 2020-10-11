export class NodeHelper {
    //todo: use js generators, wrap the whole document.evaluate function to return iterable
    static nodeListToArray = (nodeList: XPathResult): Element[] => {
        let node: Element;
        const nodeArray: Element[] = [];
        // @ts-ignore
        while ((node = nodeList.iterateNext()) !== null) {
            nodeArray.push(node);
        }
        return nodeArray;
    };
}
