import { createElement } from 'react';
import * as ReactDOM from 'react-dom';

import { ComponentDependencies, KeyDialog } from './KeyDialog/KeyDialog';
import { KeyContextMenu } from './KeyContextMenu/KeyContextMenu';
import { DEVTOOLS_ID } from './constants';

export class UI {
  private viewerComponent: KeyDialog;
  private keyContextMenu: KeyContextMenu;

  constructor(private dependencies: ComponentDependencies) {
    const rootElement = document.createElement('div');
    rootElement.id = DEVTOOLS_ID;
    rootElement.attachShadow({ mode: 'open' });
    const devTools = rootElement.shadowRoot;

    document.body.appendChild(rootElement);

    const tolgeeModalContainer = document.createElement('div');
    devTools.appendChild(tolgeeModalContainer);

    const contextMenuContainer = document.createElement('div');
    devTools.appendChild(contextMenuContainer);

    const viewerElement = createElement(KeyDialog, {
      dependencies: this.dependencies,
    });

    this.viewerComponent = ReactDOM.render(viewerElement, tolgeeModalContainer);

    this.keyContextMenu = ReactDOM.render(
      createElement(KeyContextMenu, {
        dependencies: {
          translationService: this.dependencies.translationService,
        },
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
}
