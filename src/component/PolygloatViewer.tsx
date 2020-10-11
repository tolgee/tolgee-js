import * as React from 'react';
import {TranslationDialog} from "./TranslationDialog";
import {BodyEnd} from "./BodyEnd";

type ViewerProps = {}

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
            <TranslationDialog open={this.state.dialogOpened} input={this.state.translationInput} onClose={this.onClose}/>
        </BodyEnd>;

    private onClose = () => {
        this.setState({...this.state, dialogOpened: false});
    };
}
