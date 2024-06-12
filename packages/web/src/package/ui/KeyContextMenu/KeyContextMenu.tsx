import React from 'react';
import { Menu, MenuItem, styled } from '@mui/material';

import { DEVTOOLS_Z_INDEX } from '../../constants';
import { ThemeProvider } from '../ThemeProvider';
import { getRootElement } from '../getRootElement';

const ScMenuItem = styled(MenuItem)`
  display: flex;
  flex-direction: column;
  height: 50px;
  justify-content: center;
  align-items: flex-start;
`;

const ScTranslation = styled('div')`
  display: flex;
  padding: 3px;
`;

const ScKey = styled('div')`
  display: flex;
  margin-top: -5px;
  padding: 3px;
  font-weight: bold;
  font-size: 12px;
  font-family: Monospace, 'Courier New', Courier;
`;

export interface KeyContextMenuProps {
  target: HTMLElement;
  keys: Map<string, string | undefined>;
  onSelect: (key: string | undefined) => void;
}

export type KeyContextMenuState = Partial<KeyContextMenuProps> & {
  opened: boolean;
};

type Props = {
  initialState: KeyContextMenuProps;
};

export class KeyContextMenu extends React.Component<
  Props,
  KeyContextMenuState
> {
  state: KeyContextMenuState = {
    opened: false,
  };

  constructor(props: Props) {
    super(props);
    this.state = { ...props.initialState, opened: true };
  }

  keyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      this.setState((s) => ({ ...s, opened: false }));
      this.state.onSelect && this.state.onSelect(undefined);
    }
  };

  componentDidMount() {
    document.addEventListener('keydown', this.keyDown);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.keyDown);
  }

  render() {
    return (
      <ThemeProvider>
        {this.state.opened && (
          <Menu
            disablePortal
            disableEnforceFocus
            anchorEl={this.state.target}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            open
            onClose={() => {
              this.setState({ opened: false });
              this.state.onSelect?.(undefined);
            }}
            container={getRootElement()}
            style={{ zIndex: DEVTOOLS_Z_INDEX }}
          >
            {Array.from(this.state.keys || []).map(
              ([key, translation], index) => (
                <ScMenuItem
                  onClick={() => {
                    this.state.onSelect?.(key);
                    setTimeout(() => {
                      this.setState({ opened: false });
                    });
                  }}
                  key={index}
                >
                  <ScTranslation data-testid="key_context_menu_translation">
                    {translation}
                  </ScTranslation>
                  <ScKey data-testid="key_context_menu_key">{key}</ScKey>
                </ScMenuItem>
              )
            )}
          </Menu>
        )}
      </ThemeProvider>
    );
  }
}
