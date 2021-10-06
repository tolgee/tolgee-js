import * as React from 'react';
import { TranslationService } from '@tolgee/core/lib/services/TranslationService';
import { Menu, MenuItem } from '@mui/material';

import { StylesContextProvider } from '../common/styles/StylesContextProvider';
import { ThemeProvider } from '../ThemeProvider';
import { DEVTOOLS_ID, DEVTOOLS_Z_INDEX } from '../constants';
import styled from '@emotion/styled';

const SCMenuItem = styled(MenuItem)`
  display: flex;
  flex-direction: column;
  height: 50px;
  justify-content: center;
`;

const SCTranslation = styled.div`
  display: flex;
  padding: 3px;
`;

const SCKey = styled.div`
  display: flex;
  margin-top: 10px;
  padding: 3px;
  font-weight: bold;
  font-size: 12px;
  font-family: Monospace, 'Courier New', Courier;
`;

export interface KeyContextMenuParams {
  openEvent: MouseEvent;
  keys: Set<string>;
  onSelect: (key) => void;
}

export type KeyContextMenuState = Partial<KeyContextMenuParams> & {
  opened: boolean;
};

export type ComponentDependencies = {
  translationService: TranslationService;
};

export type KeyContextMenuProps = {
  dependencies: ComponentDependencies;
};

export class KeyContextMenu extends React.Component<KeyContextMenuProps> {
  constructor(props: KeyContextMenuProps) {
    super(props);
  }

  state: KeyContextMenuState & { opened: boolean } = {
    opened: false,
  };

  async show(params: KeyContextMenuParams) {
    this.setState({ ...params, opened: true });
  }

  keyDown = (e) => {
    if (e.key === 'Escape') {
      this.setState((s) => ({ ...s, opened: false }));
      this.state.onSelect && this.state.onSelect(null);
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
      <StylesContextProvider>
        <ThemeProvider>
          {this.state.opened && (
            <Menu
              anchorEl={this.state.openEvent.target as Element}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
              }}
              open
              onClose={() => {
                this.setState({ opened: false });
                this.state.onSelect(null);
              }}
              container={document.getElementById(DEVTOOLS_ID)}
              style={{ zIndex: DEVTOOLS_Z_INDEX }}
            >
              {Array.from(this.state.keys).map((key, index) => (
                <SCMenuItem
                  onClick={() => {
                    this.setState({ opened: false });
                    this.state.onSelect(key);
                  }}
                  key={index}
                >
                  <SCTranslation>
                    {this.props.dependencies.translationService.getFromCacheOrFallback(
                      key
                    )}
                  </SCTranslation>
                  <SCKey>{key}</SCKey>
                </SCMenuItem>
              ))}
            </Menu>
          )}
        </ThemeProvider>
      </StylesContextProvider>
    );
  }
}
