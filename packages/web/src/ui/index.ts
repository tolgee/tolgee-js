import { createElement } from 'react';
import * as ReactDOM from 'react-dom';
import type {
  FallbackNSTranslation,
  UiProps,
  UiInterface,
  UiKeyOption,
} from '@tolgee/core';

import { KeyDialog } from './KeyDialog/KeyDialog';
import { KeyContextMenu } from './KeyContextMenu/KeyContextMenu';
import { DEVTOOLS_ID } from './constants';

export class UI implements UiInterface {
  private viewerComponent: KeyDialog;
  private keyContextMenu: KeyContextMenu;

  constructor(private props: UiProps) {
    let rootElement = document.getElementById(DEVTOOLS_ID);
    if (!rootElement) {
      rootElement = document.createElement('div');
      rootElement.id = DEVTOOLS_ID;
      rootElement.attachShadow({ mode: 'open' });
      document.body.appendChild(rootElement);
    }
    const devTools = rootElement.shadowRoot!;

    const tolgeeModalContainer = document.createElement('div');
    devTools.appendChild(tolgeeModalContainer);

    const contextMenuContainer = document.createElement('div');
    devTools.appendChild(contextMenuContainer);

    const viewerElement = createElement(KeyDialog, {
      ...this.props,
    });

    this.viewerComponent = ReactDOM.render(viewerElement, tolgeeModalContainer);

    this.keyContextMenu = ReactDOM.render(
      createElement(KeyContextMenu),
      contextMenuContainer
    );
  }

  public renderViewer(
    key: string,
    defaultValue: string | undefined,
    ns: FallbackNSTranslation
  ) {
    this.viewerComponent.translationEdit(key, defaultValue, ns);
  }

  public async getKey(props: {
    openEvent: MouseEvent;
    keys: Map<string, string | undefined>;
  }): Promise<string | undefined> {
    return await new Promise<string | undefined>((resolve) => {
      this.keyContextMenu.show({
        ...props,
        onSelect: (key) => resolve(key),
      });
    });
  }

  public async handleElementClick(
    event: MouseEvent,
    keysAndDefaults: UiKeyOption[]
  ) {
    let key = keysAndDefaults[0].key as string | undefined;
    if (keysAndDefaults.length > 1) {
      const keys = new Map(
        keysAndDefaults.map(({ key, translation, defaultValue }) => [
          key,
          translation || defaultValue,
        ])
      );
      key = await this.getKey({
        openEvent: event,
        keys,
      });
    }
    if (key) {
      const value = keysAndDefaults.find((val) => val.key === key)!;
      this?.renderViewer(key, value.defaultValue, value.ns);
    }
  }
}
