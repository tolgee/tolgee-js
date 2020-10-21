import {ComponentDependencies, PolygloatViewer} from "./PolygloatViewer";
import {createElement} from 'react';
import * as ReactDOM from 'react-dom';

export class UI {
    private viewerComponent: PolygloatViewer;

    constructor(private dependencies: ComponentDependencies) {
        let polygloatModalContainer = document.createElement('div');
        document.body.append(polygloatModalContainer);
        let element = createElement(PolygloatViewer, {
            dependencies: {
                coreService: this.dependencies.coreService,
                properties: this.dependencies.properties,
                eventService: this.dependencies.eventService,
                translationService: this.dependencies.translationService
            }
        });
        this.viewerComponent = ReactDOM.render(element, polygloatModalContainer);
    }

    public renderViewer(input: string){
        this.viewerComponent.translationEdit(input);
    }
}
