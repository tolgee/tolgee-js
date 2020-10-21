import {Lifecycle, scoped} from "tsyringe";
import {CoreHandler} from "./handlers/CoreHandler";
import {Properties} from "./Properties";
import {BasicTextHandler} from "./handlers/BasicTextHandler";
import {AttributeHandler} from "./handlers/AttributeHandler";

@scoped(Lifecycle.ContainerScoped)
export class Observer {
    constructor(private properties: Properties,
                private coreHandler: CoreHandler,
                private basicTextHandler: BasicTextHandler,
                private attributeHandler: AttributeHandler) {
    }

    private observer = new MutationObserver(
        async (mutationsList: MutationRecord[]) => {
            for (let mutation of mutationsList) {
                if (mutation.type === 'characterData') {
                    await this.basicTextHandler.handle(mutation.target as Element);
                    continue;
                }
                if (mutation.type === 'childList') {
                    await this.coreHandler.handleSubtree(mutation.target as Element);
                    continue;
                }
                if (mutation.type === 'attributes') {
                    await this.attributeHandler.handle(mutation.target as Element);
                }
            }
        }
    );

    public observe() {
        this.observer.observe(this.properties.config.targetElement, {attributes: true, childList: true, subtree: true, characterData: true});
    }

    public stopObserving() {
        this.observer.disconnect();
    }
}