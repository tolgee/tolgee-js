import { ElementWithMeta } from '../types';
import { PluginManager } from '../toolsManager/PluginManager';
import { DependencyStore } from '../services/DependencyStore';

export class TranslationHighlighter {
  public pluginManager: PluginManager;
  constructor(private dependencies: DependencyStore) {}

  private _renderer: any;

  private get renderer() {
    if (this._renderer === undefined) {
      if (typeof this.dependencies.properties.config.ui === 'function') {
        this._renderer = new this.dependencies.properties.config.ui(
          this.dependencies
        );
      }
    }
    return this._renderer;
  }

  private static getKeyOptions(node: ElementWithMeta): Set<string> {
    const nodes = Array.from(node._tolgee.nodes);
    const keys = nodes.reduce(
      (acc, curr) => [...acc, ...curr._tolgee.keys.map((k) => k.key)],
      []
    );
    return new Set(keys);
  }

  listen(element: ElementWithMeta & ElementCSSInlineStyle) {
    this.dependencies.highlightFunctionInitializer.initFunctions(element);
    this.dependencies.mouseEventHandler.handle(
      element,
      async (e) => await this.translationEdit(e, element)
    );
  }

  private async getKey(
    mouseEvent: MouseEvent,
    element: ElementWithMeta
  ): Promise<string> {
    if (element._tolgee.wrappedWithElementOnlyKey) {
      return element._tolgee.wrappedWithElementOnlyKey;
    }
    const keys = TranslationHighlighter.getKeyOptions(element);
    if (keys.size > 1) {
      return await this.renderer.getKey({ keys: keys, openEvent: mouseEvent });
    }
    if (keys.size === 1) {
      return Array.from(keys)[0];
    }
    // eslint-disable-next-line no-console
    console.error('No key to translate. This seems like a bug in tolgee.');
  }

  private translationEdit = async (e: MouseEvent, element: ElementWithMeta) => {
    if (typeof this.renderer === 'object') {
      const key = await this.getKey(e, element);
      if (key) {
        this.renderer.renderViewer(key);
        return;
      }
      return;
    }
    // eslint-disable-next-line no-console
    console.warn(
      'Tolgee UI is not provided. To translate interactively provide tolgee ui constructor to "ui" configuration property. ' +
        'To disable highlighting use production mode.'
    );
  };
}
