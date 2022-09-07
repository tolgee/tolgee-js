import { createElement } from 'react';
import * as ReactDOM from 'react-dom';
import type { KeyWithDefault, UiProps } from '@tolgee/core';

import { KeyDialog } from './KeyDialog/KeyDialog';
import { KeyContextMenu } from './KeyContextMenu/KeyContextMenu';
import { DEVTOOLS_ID } from './constants';

export class UI {
  private viewerComponent: KeyDialog;
  private keyContextMenu: KeyContextMenu;

  constructor(private props: UiProps) {
    const devTools = document.createElement('div');
    devTools.id = DEVTOOLS_ID;
    document.body.append(devTools);

    const tolgeeModalContainer = document.createElement('div');
    devTools.appendChild(tolgeeModalContainer);

    const contextMenuContainer = document.createElement('div');
    devTools.appendChild(contextMenuContainer);

    const viewerElement = createElement(KeyDialog, {
      dependencies: this.props,
    });

    this.viewerComponent = ReactDOM.render(viewerElement, tolgeeModalContainer);

    this.keyContextMenu = ReactDOM.render(
      createElement(KeyContextMenu, {
        getTranslation: this.props.getTranslation,
      }),
      contextMenuContainer
    );
  }

  public renderViewer(key: string, defaultValue?: string) {
    this.viewerComponent.translationEdit(key, defaultValue);
  }

  public async getKey(props: {
    openEvent: MouseEvent;
    keys: Set<string>;
  }): Promise<string> {
    return await new Promise<string>((resolve) => {
      this.keyContextMenu.show({
        ...props,
        onSelect: (key) => resolve(key),
      });
    });
  }

  public async handleElementClick(
    event: MouseEvent,
    keysAndDefaults: KeyWithDefault[]
  ) {
    let key = keysAndDefaults[0].key as string | undefined;
    if (keysAndDefaults.length > 1) {
      const keySet = new Set(keysAndDefaults.map(({ key }) => key));
      key = await this.getKey({
        openEvent: event,
        keys: keySet,
      });
    }
    if (key) {
      const defaultValue = keysAndDefaults.find(
        (val) => val.key === key
      )?.defaultValue;
      this?.renderViewer(key, defaultValue);
    }
  }
}
