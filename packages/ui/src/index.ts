import { ComponentDependencies, TolgeeViewer } from './TolgeeViewer';
import { createElement } from 'react';
import * as ReactDOM from 'react-dom';
import { KeyContextMenu } from './KeyContextMenu';

export class UI {
  private viewerComponent: TolgeeViewer;
  private keyContextMenu: KeyContextMenu;

  constructor(private dependencies: ComponentDependencies) {
    const tolgeeModalContainer = document.createElement('div');
    document.body.append(tolgeeModalContainer);

    const contextMenuContainer = document.createElement('div');
    document.body.append(contextMenuContainer);

    const viewerElement = createElement(TolgeeViewer, {
      dependencies: {
        coreService: this.dependencies.coreService,
        properties: this.dependencies.properties,
        eventService: this.dependencies.eventService,
        translationService: this.dependencies.translationService,
      },
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

  public renderViewer(key: string) {
    this.viewerComponent.translationEdit(key);
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

export default UI;
