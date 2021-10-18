import { ElementWithMeta } from '../types';
import { PluginManager } from '../toolsManager/PluginManager';
import { DependencyStore } from '../services/DependencyStore';

type KeyWithDefault = { key: string; defaultValue?: string };

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

  private static getKeyOptions(node: ElementWithMeta): KeyWithDefault[] {
    const nodes = Array.from(node._tolgee.nodes);
    return nodes.reduce(
      (acc, curr) => [
        ...acc,
        ...curr._tolgee.keys.map((k) => ({
          key: k.key,
          defaultValue: k.defaultValue,
        })),
      ],
      []
    );
  }

  listen(element: ElementWithMeta & ElementCSSInlineStyle) {
    this.dependencies.highlightFunctionInitializer.initFunctions(element);
    this.dependencies.mouseEventHandler.handle(
      element,
      async (e) => await this.translationEdit(e, element)
    );
  }

  private async getKeyAndDefault(
    mouseEvent: MouseEvent,
    element: ElementWithMeta
  ): Promise<KeyWithDefault> {
    if (element._tolgee.wrappedWithElementOnlyKey) {
      return {
        key: element._tolgee.wrappedWithElementOnlyKey,
        defaultValue: element._tolgee.wrappedWithElementOnlyDefaultHtml,
      };
    }
    const keysWithDefaults = TranslationHighlighter.getKeyOptions(element);

    // create Set to remove duplicated key values
    const keySet = new Set(
      keysWithDefaults.map((keyWithDefault) => keyWithDefault.key)
    );
    if (keySet.size > 1) {
      // this opens the popover where user chooses the key
      const selectedKey = await this.renderer.getKey({
        keys: keySet,
        openEvent: mouseEvent,
      });
      // get the key with default
      const found = keysWithDefaults.find((kwd) => kwd.key === selectedKey);
      if (found) {
        return found;
      }
    }
    if (keySet.size === 1) {
      return keysWithDefaults[0];
    }
    // eslint-disable-next-line no-console
    console.error('No key to translate. This seems like a bug in tolgee.');
  }

  private translationEdit = async (e: MouseEvent, element: ElementWithMeta) => {
    if (typeof this.renderer === 'object') {
      const key = await this.getKeyAndDefault(e, element);
      if (key) {
        this.renderer.renderViewer(key.key, key.defaultValue);
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
