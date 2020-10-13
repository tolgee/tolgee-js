import {PolygloatViewer} from './component/PolygloatViewer';
import {createElement} from 'react';
import * as ReactDOM from 'react-dom';
import {PolygloatService} from './services/polygloatService';
import {PolygloatSimpleSpanElement, PolygloatTextInputElement} from './Types';
import {Lifecycle, scoped} from 'tsyringe';
import {Properties} from './Properties';
import {EventService} from "./services/EventService";

@scoped(Lifecycle.ContainerScoped)
export class TranslationHighlighter {
    private viewerComponent: PolygloatViewer;

    private isKeyDown = (() => {
        let state = {};

        window.addEventListener('keyup', (e) => state[e.key] = false);
        window.addEventListener('keydown', (e) => state[e.key] = true);

        return (key) => state.hasOwnProperty(key) && state[key] || false;
    })();

    constructor(private service: PolygloatService, private properties: Properties, private eventService: EventService) {
        let polygloatModalContainer = document.createElement('div');
        document.body.append(polygloatModalContainer);
        let element = createElement(PolygloatViewer, {
            dependencies: {
                polygloatService: service,
                properties: properties,
                eventService: eventService
            }
        });
        this.viewerComponent = ReactDOM.render(element, polygloatModalContainer);
    }

    listen(node: Element) {
        node.addEventListener('mouseenter', () => this.onMouseOver(node));
    }

    onMouseOver = (node): void => {
        const clickListener = (e: MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            this.translationEdit(node);
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

    private getInput(node: Element): Promise<string> {
        return new Promise(resolve => {
            if (node instanceof HTMLSpanElement) {
                resolve((node as PolygloatSimpleSpanElement).__polygloat.input);
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
                        let translation = this.service.instant(input, this.properties.currentLanguage);
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
        let input = await this.getInput(node);
        this.viewerComponent.translationEdit(input);
    };
}
