import * as React from 'react';
import {TranslationDialog} from "./TranslationDialog";
import {BodyEnd} from "./BodyEnd";
import {CoreService} from "../core/services/CoreService";
import {Properties} from "../core/Properties";
import {EventService} from "../core/services/EventService";
import {TranslationService} from "../core/services/TranslationService";

export type ComponentDependencies = {
    coreService: CoreService,
    translationService: TranslationService,
    properties: Properties,
    eventService: EventService
}

export type ViewerProps = {
    dependencies: ComponentDependencies
}

export class PolygloatViewer extends React.Component<ViewerProps> {
    state = {
        translationInput: null,
        dialogOpened: false
    };

    constructor(props: ViewerProps) {
        super(props);
    }

    public translationEdit(input) {
        this.setState({...this.state, dialogOpened: true, translationInput: input});
    }

    public render = () =>
        <BodyEnd>
            <TranslationDialog dependencies={this.props.dependencies} open={this.state.dialogOpened} input={this.state.translationInput}
                               onClose={this.onClose}/>
        </BodyEnd>;

    private onClose = () => {
        this.setState({...this.state, dialogOpened: false});
    };
}
