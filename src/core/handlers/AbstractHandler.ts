import {NodeHelper} from "../helpers/NodeHelper";
import {Properties} from "../Properties";
import {ElementMeta, ElementWithMeta, KeyAndParams, NodeWithMeta} from "../Types";
import {TextService} from "../services/TextService";
import {NodeRegistrar} from "../services/NodeRegistrar";
import {TranslationHighlighter} from "../highlighter/TranslationHighlighter";
import {RESTRICTED_ASCENDANT_ATTRIBUTE} from "../../Constants/Global";

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
                && e.closest(`[${RESTRICTED_ASCENDANT_ATTRIBUTE}=\"true\"]`) === null;
        });
    }

    protected async handleNodes(nodes: Array<Text | Attr>) {
        for (const textNode of nodes) {
            const result = await this.textService.replace(textNode.textContent);
            if (result) {
                const {text, keys} = result;
                let translatedNode = this.translateChildNode(textNode, text, keys);
                const parentElement = AbstractHandler.getParentElement(translatedNode);
                parentElement._polygloat.nodes.add(translatedNode);
                this.registerForHighlighting(parentElement);
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

    protected registerForHighlighting(element: ElementWithMeta) {
        if (this.properties.config.mode === "development") {
            this.translationHighlighter.listen(element);
        }
    }

    private static initParentElement(element: Element): ElementWithMeta {
        if (element["_polygloat"] === undefined) {
            element["_polygloat"] = {
                nodes: new Set()
            } as ElementMeta
            element.setAttribute("_polygloat", "");
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