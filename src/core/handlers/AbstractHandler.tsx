import {NodeHelper} from "../helpers/NodeHelper";
import {Properties} from "../Properties";
import {ElementMeta, ElementWithMeta, KeyAndParams, NodeWithMeta} from "../Types";
import {TextService} from "../services/TextService";
import {NodeRegistrar} from "../services/NodeRegistrar";
import {TranslationHighlighter} from "../TranslationHighlighter";

export abstract class AbstractHandler {
    protected constructor(protected properties: Properties,
                          protected textService: TextService,
                          protected nodeRegistrar: NodeRegistrar,
                          protected translationHighlighter: TranslationHighlighter) {
    }

    abstract async handle(node: Node);

    protected filterRestricted<T extends Element | Text>(nodes: T[]) {
        let restrictedElements = this.properties.config.restrictedElements;
        return nodes.filter(n => {
            let e = NodeHelper.closestElement(n);
            return restrictedElements.indexOf(e.tagName.toLowerCase()) === -1
                && e.closest("[data-polygloat-restricted=\"true\"]") === null;
        });
    }

    protected async translateParentNodes(nodes: Iterable<Text | Attr>) {
        for (const textNode of nodes) {
            const result = await this.textService.replace(textNode.textContent);

            if (result) {
                const {newValue, keysAndParams} = result;
                let translatedNode = this.translateChildNode(textNode, newValue, keysAndParams);
                this.registerForHighlighting(translatedNode);
            }
        }
    }

    protected translateChildNode(node: (Text | Attr), newValue, keys: KeyAndParams[]) {
        this.nodeRegistrar.register(node);
        node["_polygloat"] = {
            oldTextContent: node.textContent,
            keys
        };
        node.textContent = newValue;
        return node as Node as NodeWithMeta;
    }

    protected registerForHighlighting(node: NodeWithMeta) {
        if (this.properties.config.mode === "development") {
            const parentElement = AbstractHandler.getParentElement(node);
            parentElement._polygloat.nodes.add(node);
            this.translationHighlighter.listen(parentElement);
        }
    }

    private static initParentElement(element: Element): ElementWithMeta {
        if (element["_polygloat"] === undefined) {
            element["_polygloat"] = {
                nodes: new Set()
            } as ElementMeta
        }

        if (element.hasAttribute("_polygloat")) {
            element.setAttribute("_polygloat", "")
        }

        return element as ElementWithMeta;
    }

    private static getParentElement(node: Node) {
        return AbstractHandler.initParentElement(NodeHelper.getParentElement(node));
    }
}