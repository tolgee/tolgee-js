import {Lifecycle, scoped} from "tsyringe";
import {CoreHandler} from "./handlers/CoreHandler";
import {Properties} from "./Properties";
import {TextHandler} from "./handlers/TextHandler";
import {AttributeHandler} from "./handlers/AttributeHandler";
import {ElementRegistrar} from "./services/ElementRegistrar";

@scoped(Lifecycle.ContainerScoped)
export class Observer {
    constructor(private properties: Properties,
                private coreHandler: CoreHandler,
                private basicTextHandler: TextHandler,
                private attributeHandler: AttributeHandler,
                private nodeRegistrar: ElementRegistrar) {
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
            this.nodeRegistrar.refreshAll();
        }
    );

    public observe() {
        this.observer.observe(this.properties.config.targetElement, {attributes: true, childList: true, subtree: true, characterData: true});
    }

    public stopObserving() {
        this.observer.disconnect();
    }
}