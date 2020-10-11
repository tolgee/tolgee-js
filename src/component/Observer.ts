import {container, injectable} from "tsyringe";
import {NodeHelper} from "../helpers/NodeHelper";
import {CoreHandler} from "../handlers/CoreHandler";
import {Properties} from "../Properties";

@injectable()
export class Observer {
    constructor(private properties: Properties) {
    }

    private coreHandler: CoreHandler = container.resolve(CoreHandler);
    private observer = new MutationObserver(
        async (mutationsList: MutationRecord[]) => {
            for (let mutation of mutationsList) {
                if (mutation.type === 'characterData') {
                    if (!!mutation.target.parentElement) {
                        await this.coreHandler.onNewNodes([mutation.target.parentElement]);
                    }
                }
                if (mutation.type === 'childList') {
                    await this.handleSubtree(mutation.target);
                }
                if (mutation.type === 'attributes') {
                    await this.coreHandler.handleAttribute(mutation);
                }
            }
        });

    public async handleSubtree(target: Node) {
        let xPath = `./descendant-or-self::*[text()[contains(., '${this.properties.config.inputPrefix}') and contains(., '${this.properties.config.inputPostfix}')]]`;
        let nodes: XPathResult = document.evaluate(xPath, target, null, XPathResult.ANY_TYPE);
        let inputNodes = (target as Element).getElementsByTagName("input");
        let polygloatInputs = Array.from(inputNodes)
            .filter(i => i.value.indexOf(this.properties.config.inputPrefix) > -1);

        const newNodes = NodeHelper.nodeListToArray(nodes).concat(polygloatInputs)
            .filter(n => this.properties.config.restrictedElements.indexOf(n.tagName.toLowerCase()) === -1);
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