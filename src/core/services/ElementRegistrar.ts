import {Lifecycle, scoped} from "tsyringe";
import {ElementWithMeta} from "../types";
import {Properties} from "../Properties";
import {POLYGLOAT_ATTRIBUTE_NAME} from "../../Constants/Global";
import {TranslationHighlighter} from "../highlighter/TranslationHighlighter";

@scoped(Lifecycle.ContainerScoped)
export class ElementRegistrar {
    private registeredElements: Set<ElementWithMeta> = new Set();

    constructor(private properties: Properties, private translationHighlighter: TranslationHighlighter) {
    }

    register(element: ElementWithMeta) {
        if (this.getActiveNodes(element).next().value === undefined) {
            throw new Error("Registered element with no nodes. This is probably an bug in Polygloat.");
        }
        this.registeredElements.add(element);
        if (this.properties.config.mode === "development") {
            this.translationHighlighter.listen(element);
        }
    }

    refreshAll() {
        for (const element of this.registeredElements) {
            this.cleanElementInactiveNodes(element);
            if (element._polygloat.nodes.size === 0) {
                this.cleanElement(element);
            }
        }
    }

    cleanAll() {
        for (const registeredElement of this.registeredElements) {
            this.cleanElement(registeredElement);
        }
    }

    private cleanElementInactiveNodes(element: ElementWithMeta) {
        if (this.isElementActive(element)) {
            element._polygloat.nodes = new Set(this.getActiveNodes(element));
            return;
        }
    }

    private cleanElement(element: ElementWithMeta) {
        if (typeof element._polygloat.removeAllEventListeners === "function") {
            element._polygloat.removeAllEventListeners();
        }
        element.removeAttribute(POLYGLOAT_ATTRIBUTE_NAME);
        delete element._polygloat;
        this.registeredElements.delete(element);
    }

    private* getActiveNodes(element: ElementWithMeta) {
        for (const node of element._polygloat.nodes) {
            if (this.properties.config.targetElement.contains(node)) {
                yield node;
            }
        }
    }

    private isElementActive(element: ElementWithMeta) {
        return this.properties.config.targetElement.contains(element);
    }
}