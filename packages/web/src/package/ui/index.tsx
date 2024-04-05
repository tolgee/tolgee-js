import type { UiProps, UiInterface, UiKeyOption } from '@tolgee/core';

import { KeyDialog } from './KeyDialog/KeyDialog';
import { getRootElement } from './getRootElement';
import { Root, createRoot } from 'react-dom/client';
import { KeyContextMenu } from './KeyContextMenu/KeyContextMenu';

export class UI implements UiInterface {
  private rootElement: ShadowRoot | undefined;
  tolgeeModalRoot: Root;
  contextMenuRoot: Root;

  constructor(private props: UiProps) {}

  public checkInitialization() {
    const rootElement = getRootElement();
    if (rootElement !== this.rootElement) {
      this.rootElement = rootElement;

      const tolgeeModalContainer = document.createElement('div');
      rootElement.appendChild(tolgeeModalContainer);
      this.tolgeeModalRoot = createRoot(tolgeeModalContainer);

      const contextMenuContainer = document.createElement('div');
      rootElement.appendChild(contextMenuContainer);
      this.contextMenuRoot = createRoot(contextMenuContainer);
    }
  }

  public renderViewer(
    key: string,
    defaultValue: string | undefined,
    fallbackNamespaces: string[],
    namespace: string
  ) {
    this.checkInitialization();
    this.tolgeeModalRoot.render(
      <KeyDialog
        uiProps={this.props}
        keyData={{
          key,
          defaultValue,
          dialogOpened: true,
          fallbackNamespaces,
          namespace,
        }}
      />
    );
  }

  public async getKey(props: {
    keys: Map<string, string | undefined>;
    target: HTMLElement;
  }): Promise<string | undefined> {
    return await new Promise<string | undefined>((resolve) => {
      this.checkInitialization();
      this.contextMenuRoot.render(
        <KeyContextMenu
          // get rid of element state
          key={Math.random()}
          initialState={{
            ...props,
            onSelect(key) {
              resolve(key);
            },
          }}
        />
      );
    });
  }

  public async handleElementClick(
    keysAndDefaults: UiKeyOption[],
    target: HTMLElement
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
        target,
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
