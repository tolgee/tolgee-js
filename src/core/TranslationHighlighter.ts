import {CoreService} from './services/CoreService';
import {PolygloatSimpleSpanElement, PolygloatTextInputElement} from './Types';
import {Lifecycle, scoped} from 'tsyringe';
import {Properties} from './Properties';
import {EventService} from "./services/EventService";
import {UI} from "polygloat/ui";
import {TranslationService} from "./services/TranslationService";

@scoped(Lifecycle.ContainerScoped)
export class TranslationHighlighter {
    private _renderer: UI;

    constructor(private service: CoreService,
                private properties: Properties,
                private eventService: EventService,
                private translationService: TranslationService) {
    }

    private isKeyDown = (() => {
        let state = {};

        window.addEventListener('keyup', (e) => state[e.key] = false);
        window.addEventListener('keydown', (e) => state[e.key] = true);

        return (key) => state.hasOwnProperty(key) && state[key] || false;
    })();

    private get renderer() {
        if (this._renderer === undefined) {
            if (typeof this.properties.config.ui === "function") {
                this._renderer = new this.properties.config.ui({
                    coreService: this.service,
                    properties: this.properties,
                    eventService: this.eventService,
                    translationService: this.translationService
                });
            }
        }
        return this._renderer;
    }

    listen(node: Element) {
        node.addEventListener('mouseenter', () => this.onMouseOver(node));
    }

    onMouseOver = (node): void => {
        const clickListener = (e: MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            this.translationEdit(node).then();
        };

        const leaveListener = () => {
            node.style.backgroundColor = null;
            node.removeEventListener('click', clickListener);
            node.removeEventListener('mouseleave', leaveListener);
            window.removeEventListener('keydown', altDownListener);
            window.removeEventListener('keyup', altUpListener);
        };

        const altDownListener = () => {
            if (this.isKeyDown('Alt')) {
                doHighlight();
                window.addEventListener('keyup', altUpListener);
            }
            window.removeEventListener('keydown', altDownListener);
        };

        const doHighlight = () => {
            node.style.backgroundColor = 'yellow';
            node.addEventListener('click', clickListener);
        };

        const altUpListener = () => {
            node.style.backgroundColor = null;
            node.removeEventListener('click', clickListener);
            window.addEventListener('keydown', altDownListener);
            window.removeEventListener('keyup', altUpListener);
        };

        window.addEventListener('keyup', altUpListener);


        if (this.isKeyDown('Alt')) {
            doHighlight();
        } else {
            window.addEventListener('keydown', altDownListener);
        }

        node.addEventListener('mouseleave', leaveListener);
    };

    private getKey(node: Element): Promise<string> {
        return new Promise(resolve => {
            if (node instanceof HTMLSpanElement) {
                resolve((node as PolygloatSimpleSpanElement).__polygloat.key);
                return;
            }

            if (node instanceof HTMLTextAreaElement || node instanceof HTMLInputElement) {
                let textInputElement: PolygloatTextInputElement = (node as any) as PolygloatTextInputElement;

                if (textInputElement.__polygloat.valueInputs.length < 1 && textInputElement.__polygloat.placeholderInputs.length > 0) {
                    resolve(textInputElement.__polygloat.placeholderInputs[0]);
                    return;
                }

                textInputElement.addEventListener('blur', () => {
                    let position = textInputElement.selectionStart;
                    let nearest = textInputElement.__polygloat.valueInputs[0];
                    let nearestDistance = undefined;

                    for (const input of textInputElement.__polygloat.valueInputs) {
                        let translation = this.translationService.getFromCacheOrFallback(input, this.properties.currentLanguage);
                        let index = 0;
                        let end = 0;
                        do {
                            index = textInputElement.value.indexOf(translation, end);
                            let start = index;

                            end = index + translation.length;
                            //check for total match (caret is inside of translation)
                            if (start < position && end > position) {
                                resolve(input);
                                return;
                            }
                            let distance = Math.min(Math.abs(position - start), Math.abs(position - end));
                            if (nearestDistance === undefined || distance < nearestDistance) {
                                nearestDistance = distance;
                                nearest = input;
                            }
                        } while (index > -1);
                    }
                    resolve(nearest);
                    return;
                });
                textInputElement.blur();
            }
        });
    }

    private translationEdit = async (node) => {
        let input = await this.getKey(node);
        if (typeof this.renderer === "object") {
            this.renderer.renderViewer(input)
            return;
        }
        console.warn("Polygloat UI is not provided. To translate interactively provide polygloat ui constructor to \"ui\" configuration property. " +
            "To disable highlighting use production mode.");
    };
}
