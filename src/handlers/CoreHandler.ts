import {NodeHelper} from '../helpers/NodeHelper';
import {PolygloatService} from '../services/polygloatService';
import {BasicTextHandler} from './BasicTextHandler';
import {TextAreaHandler} from './TextAreaHandler';
import {injectable} from 'tsyringe';
import {EventService} from '../services/EventService';
import {Properties} from '../Properties';
import {InputHandler} from './InputHandler';

@injectable()
export class CoreHandler {
    constructor(private service: PolygloatService,
                private basicTextHandler: BasicTextHandler,
                private textAreaHandler: TextAreaHandler,
                private inputHandler: InputHandler,
                private eventService: EventService,
                private properties: Properties) {

        eventService.LANGUAGE_CHANGED.subscribe(() => {
            this.refresh().then(() => {
            });
        });

        eventService.TRANSLATION_CHANGED.subscribe(() => {
            this.refresh().then(() => {
            });
        });
    }

    onNewNodes = async (nodes: Element[]): Promise<void> => {
        for (const node of nodes) {
            const hasAncestor = node.parentNode !== null;
            //texts inside newValue areas can not be replaced with spans, because it is not going to be rendered properly
            let textInputParent = node.closest("textarea, input")
            if (textInputParent === null) {
                await this.basicTextHandler.handleNewNode(node);
                continue;
            }
            if (textInputParent instanceof HTMLTextAreaElement) {
                await this.textAreaHandler.handleNewNode(textInputParent);
                continue;
            }
            if (textInputParent instanceof HTMLInputElement) {
                await this.inputHandler.handleNewNode(textInputParent);
            }
        }
    };

    async handleAttribute(mutation: MutationRecord) {
        const target = (mutation.target as HTMLElement);
        if (this.isAttributeAllowed(target.tagName, mutation.attributeName)) {
            if (target.getAttribute(mutation.attributeName).indexOf(this.properties.config.inputPrefix) > -1) {
                if (target.getAttribute('_polygloat') !== '') {
                    this.onNewNodes([target]);
                }
            }
        }
    }

    async refresh() {
        let nodeList = document.evaluate(`//*[@_polygloat]`, this.properties.config.targetElement, null, XPathResult.ANY_TYPE);
        for (const node of NodeHelper.nodeListToArray(nodeList)) {
            if (node instanceof HTMLSpanElement) {
                await this.basicTextHandler.refresh(node);
                continue;
            }
            if (node instanceof HTMLTextAreaElement) {
                await this.textAreaHandler.refresh(node);
            }
            if (node instanceof HTMLInputElement) {
                await this.inputHandler.refresh(node);
            }
        }
    }

    isAttributeAllowed(tagName: string, attribute: string): boolean {
        let tagsFiltered = Object.keys(this.properties.config.tagAttributes).filter(k => k.toLowerCase() === tagName.toLowerCase());
        if (tagsFiltered.length < 1) {
            return false;
        }
        return this.properties.config.tagAttributes[tagsFiltered[0]]
            .filter(attr => attr.toLowerCase() === attribute.toLowerCase()).length > 0;
    }

}
