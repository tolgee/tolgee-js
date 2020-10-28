import * as React from 'react';
import {ContextMenu} from "./common/ContextMenu/ContextMenu";
import {ContextMenuItem} from "./common/ContextMenu/ContextMenuItem";
import {TranslationService} from "../core/services/TranslationService";

export interface KeyContextMenuParams {
    openEvent: MouseEvent;
    keys: Set<string>;
    onSelect: (key) => void;
}

export type KeyContextMenuState = Partial<KeyContextMenuParams> & {
    opened: boolean
}

export type ComponentDependencies = {
    translationService: TranslationService,
}

export type KeyContextMenuProps = {
    dependencies: ComponentDependencies
}

export class KeyContextMenu extends React.Component<KeyContextMenuProps> {
    constructor(props: KeyContextMenuProps) {
        super(props);
    }

    state: KeyContextMenuState & { opened: boolean } = {
        opened: false
    };

    async show(params: KeyContextMenuParams) {
        this.setState({...params, opened: true})
    }

    render() {
        return (
            <>
                {this.state.opened &&
                <ContextMenu openEvent={this.state.openEvent} onClose={() => {
                    this.setState({opened: false});
                    this.state.onSelect(null);
                }}>
                    {Array.from(this.state.keys).map((key, index) =>
                        <ContextMenuItem
                            onClick={() => this.state.onSelect(key)}
                            key={index}>
                            {this.props.dependencies.translationService.getFromCacheOrFallback(key)}
                            <div style={{marginTop: "5px"}}>
                                <span style={
                                    {
                                        backgroundColor: "#F8F8FE",
                                        borderRadius: "3px",
                                        padding: "3px",
                                        fontWeight: "bold",
                                        fontSize: "12px"
                                    }}>{key}</span>
                            </div>
                        </ContextMenuItem>)}
                </ContextMenu>}
            </>
        )
    }
}
