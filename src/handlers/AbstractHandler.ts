import {NodeHelper} from "../helpers/NodeHelper";
import {Properties} from "../Properties";
import {ElementMeta, ElementWithMeta, KeyAndParams, NodeWithMeta} from "../types";
import {TextService} from "../services/TextService";
import {ElementRegistrar} from "../services/ElementRegistrar";
import {TranslationHighlighter} from "../highlighter/TranslationHighlighter";
import {POLYGLOAT_ATTRIBUTE_NAME, RESTRICTED_ASCENDANT_ATTRIBUTE} from "../Constants/Global";

export abstract class AbstractHandler {
    protected constructor(protected properties: Properties,
                          protected textService: TextService,
                          protected elementRegistrar: ElementRegistrar,
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
                const parentElement = this.getParentElement(translatedNode);
                parentElement._polygloat.nodes.add(translatedNode);
                this.elementRegistrar.register(parentElement);
            }
        }
    }

    protected translateChildNode(node: (Text | Attr), newValue, keys: KeyAndParams[]) {
        node[POLYGLOAT_ATTRIBUTE_NAME] = {
            oldTextContent: node.textContent,
            keys
        };
        node.textContent = newValue;
        return node as Node as NodeWithMeta;
    }

    private static initParentElement(element: Element): ElementWithMeta {
        if (element[POLYGLOAT_ATTRIBUTE_NAME] === undefined) {
            element[POLYGLOAT_ATTRIBUTE_NAME] = {
                nodes: new Set()
            } as ElementMeta
            element.setAttribute(POLYGLOAT_ATTRIBUTE_NAME, "");
        }

        return element as ElementWithMeta;
    }

    private getParentElement(node: Node) {
        const parent = this.getSuitableParent(node);
        return AbstractHandler.initParentElement(parent);
    }

    private getSuitableParent(node: Node): Element {
        const domParent = NodeHelper.getParentElement(node);

        if(domParent === undefined){
            console.error(node);
            throw new Error("No suitable parent found for node above.")
        }

        if (!this.properties.config.passToParent) {
            return domParent;
        }

        if (Array.isArray(this.properties.config.passToParent)) {
            const tagNameEquals = (elementTagName: string) => domParent.tagName.toLowerCase() === elementTagName.toLowerCase();
            if (this.properties.config.passToParent.findIndex(tagNameEquals) === -1) {
                return domParent;
            }
        }

        if (typeof this.properties.config.passToParent === "function") {
            if (!this.properties.config.passToParent(domParent)) {
                return domParent;
            }
        }

        return this.getSuitableParent(domParent);
    }
}