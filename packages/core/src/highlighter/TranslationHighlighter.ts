import { ElementWithMeta } from '../types';
import { PluginManager } from '../toolsManager/PluginManager';
import { DependencyStore } from '../services/DependencyStore';

type KeyWithDefault = { key: string; defaultValue?: string };

export class TranslationHighlighter {
  public pluginManager: PluginManager;
  private _renderer: any;

  constructor(private dependencies: DependencyStore) {}

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

  private async getRenderer() {
    if (this._renderer === undefined) {
      const possibleProviders = [
        this.dependencies.properties.config.ui,
        window['@tolgee/ui'],
      ];
      for (const possibleProvider of possibleProviders) {
        if (typeof possibleProvider === 'function') {
          try {
            // try to get constructor from promise provider
            // This is used when UI passed using dynamic import
            const constructorProvider = possibleProvider as () => Promise<
              new (...args) => any
            >;
            const constructor = await constructorProvider();
            this._renderer = new constructor(this.dependencies);
          } catch (e) {
            // If not passed using dynamic import it's passed as standard constructor
            const constructor = possibleProvider as new (...arg) => any;
            this._renderer = new constructor(this.dependencies);
          }
        }
      }
      if (this._renderer === undefined) {
        // eslint-disable-next-line no-console
        console.warn(
          'Tolgee UI is not provided. To translate interactively provide tolgee ui constructor to "ui" configuration property. ' +
            'To disable highlighting use production mode.'
        );
      }
    }
    return this._renderer;
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
      const renderer = await this.getRenderer();
      // this opens the popover where user chooses the key
      const selectedKey = await renderer.getKey({
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
    const renderer = await this.getRenderer();
    if (typeof renderer === 'object') {
      const key = await this.getKeyAndDefault(e, element);
      if (key) {
        renderer.renderViewer(key.key, key.defaultValue);
        return;
      }
      return;
    }
  };
}
