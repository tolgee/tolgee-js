import {NodeHelper} from '../helpers/NodeHelper';
import {CoreService} from '../services/CoreService';
import {TextHandler} from './TextHandler';
import {Lifecycle, scoped} from 'tsyringe';
import {EventService} from '../services/EventService';
import {Properties} from '../Properties';
import {AttributeHandler} from "./AttributeHandler";
import {ElementWithMeta} from "../types";
import {TextService} from "../services/TextService";

@scoped(Lifecycle.ContainerScoped)
export class CoreHandler {
    constructor(private service: CoreService,
                private basicTextHandler: TextHandler,
                private eventService: EventService,
                private properties: Properties,
                private attributeHandler: AttributeHandler,
                private textService: TextService
    ) {

        eventService.LANGUAGE_CHANGED.subscribe(this.refresh.bind(this));
        eventService.TRANSLATION_CHANGED.subscribe(this.refresh.bind(this));
    }

    public async handleSubtree(target: Element) {
        await this.attributeHandler.handle(target);
        await this.basicTextHandler.handle(target);
    }

    private async refresh() {
        let nodes: ElementWithMeta[] = NodeHelper.evaluate(`//*[@_tolgee]`, this.properties.config.targetElement);
        for (const node of nodes) {
            for (const textNode of node._tolgee.nodes) {
                const result = await this.textService.replace(textNode._tolgee.oldTextContent);
                if (result) {
                    textNode.textContent = result.text;
                }
            }
        }
    }
}
