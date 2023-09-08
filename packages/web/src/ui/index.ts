import { createElement } from 'react';
import * as ReactDOM from 'react-dom';
import type { UiProps, UiInterface, UiKeyOption } from '@tolgee/core';

import { KeyDialog } from './KeyDialog/KeyDialog';
import { KeyContextMenu } from './KeyContextMenu/KeyContextMenu';
import { getRootElement } from './getRootElement';

export class UI implements UiInterface {
  private rootElement: ShadowRoot | undefined;
  private viewerComponent: KeyDialog | undefined;
  private keyContextMenu: KeyContextMenu | undefined;

  constructor(private props: UiProps) {
    this.checkInitialization();
  }

  public checkInitialization() {
    const rootElement = getRootElement();
    if (rootElement !== this.rootElement) {
      this.rootElement = rootElement;

      const tolgeeModalContainer = document.createElement('div');
      rootElement.appendChild(tolgeeModalContainer);

      const contextMenuContainer = document.createElement('div');
      rootElement.appendChild(contextMenuContainer);

      const viewerElement = createElement(KeyDialog, {
        ...this.props,
      });

      this.viewerComponent = ReactDOM.render(
        viewerElement,
        tolgeeModalContainer
      );

      this.keyContextMenu = ReactDOM.render(
        createElement(KeyContextMenu),
        contextMenuContainer
      );
    }
  }

  public renderViewer(
    key: string,
    defaultValue: string | undefined,
    fallbackNamespaces: string[],
    namespace: string
  ) {
    this.checkInitialization();
    this.viewerComponent?.translationEdit(
      key,
      defaultValue,
      fallbackNamespaces,
      namespace
    );
  }

  public async getKey(props: {
    keys: Map<string, string | undefined>;
    openEvent: MouseEvent;
  }): Promise<string | undefined> {
    this.checkInitialization();
    return await new Promise<string | undefined>((resolve) => {
      this.keyContextMenu?.show({
        ...props,
        onSelect(key) {
          resolve(key);
        },
      });
    });
  }

  public async handleElementClick(
    keysAndDefaults: UiKeyOption[],
    event: MouseEvent
  ) {
    this.checkInitialization();
    let key = keysAndDefaults[0].key as string | undefined;
    const keysMap = new Map(
      keysAndDefaults.map(({ key, translation, defaultValue }) => [
        key,
        translation || defaultValue,
      ])
    );
    if (keysMap.size > 1) {
      key = await this.getKey({
        keys: keysMap,
        openEvent: event,
      });
    }
    if (key) {
      const value = keysAndDefaults.find((val) => val.key === key)!;
      this?.renderViewer(
        key,
        value.defaultValue,
        value.fallbackNamespaces,
        value.namespace
      );
    }
  }
}
