import {Lifecycle, scoped} from "tsyringe";
import {NodeHelper} from "./helpers/NodeHelper";
import {CoreHandler} from "./handlers/CoreHandler";
import {Properties} from "./Properties";

@scoped(Lifecycle.ContainerScoped)
export class Observer {
    constructor(private properties: Properties, private coreHandler: CoreHandler) {
    }

    private observer = new MutationObserver(
        async (mutationsList: MutationRecord[]) => {
            for (let mutation of mutationsList) {
                if (mutation.type === 'characterData') {
                    if (!!mutation.target.parentElement) {
                        await this.coreHandler.onNewNodes([mutation.target.parentElement]);
                    }
                    continue;
                }
                if (mutation.type === 'childList') {
                    await this.handleSubtree(mutation.target);
                    continue;
                }
                if (mutation.type === 'attributes') {
                    await this.coreHandler.handleAttribute(mutation);
                }
            }
        });

    public async handleSubtree(target: Node) {
        let inputPrefix = this.properties.config.inputPrefix;
        let inputPostfix = this.properties.config.inputPostfix;

        let xPath = `./descendant-or-self::*[text()[contains(., '${inputPrefix}') and contains(., '${inputPostfix}')]]`;
        let nodes: XPathResult = document.evaluate(xPath, target, null, XPathResult.ANY_TYPE);
        let inputNodes = (target as Element).getElementsByTagName("input");

        let polygloatInputs = Array.from(inputNodes)
            .filter(i => i.value.indexOf(inputPrefix) > -1 && i.value.indexOf(inputPostfix) > -1);

        let restrictedElements = this.properties.config.restrictedElements;
        const newNodes = NodeHelper.nodeListToArray(nodes)
            .concat(polygloatInputs)
            .filter(n => restrictedElements.indexOf(n.tagName.toLowerCase()) === -1 && n.closest("[data-polygloat-restricted=\"true\"]") === null);

        if (newNodes.length) {
            await this.coreHandler.onNewNodes(newNodes);
        }
    }

    public observe() {
        this.observer.observe(this.properties.config.targetElement, {attributes: true, childList: true, subtree: true, characterData: true});
    }

    public stopObserving() {
        this.observer.disconnect();
    }
}