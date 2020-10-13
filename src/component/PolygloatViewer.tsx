import * as React from 'react';
import {TranslationDialog} from "./TranslationDialog";
import {BodyEnd} from "./BodyEnd";
import {PolygloatService} from "../services/polygloatService";
import {Properties} from "../Properties";
import {EventService} from "../services/EventService";

export type ComponentDependencies = {
    polygloatService: PolygloatService,
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
