import { ElementWithMeta } from '../types';
import { PluginManager } from '../toolsManager/PluginManager';
import { DependencyService } from '../services/DependencyService';

type KeyWithDefault = { key: string; defaultValue?: string };

export class TranslationHighlighter {
  public pluginManager: PluginManager;
  private _renderer: any;

  constructor(private dependencies: DependencyService) {}

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
  }

  private async getRenderer() {
    if (this._renderer === undefined) {
      const possibleProviders = [
        this.dependencies.properties.config.ui,
        window['@tolgee/ui'],
      ];
      for (const possiblePromise of possibleProviders) {
        // if dynamic import is used
        const possibleObject =
          possiblePromise instanceof Promise
            ? await possiblePromise
            : possiblePromise;

        // extract .UI property
        const possibleProvider =
          typeof possibleObject === 'object'
            ? possibleObject?.UI
            : possibleObject;

        if (typeof possibleProvider === 'function') {
          this._renderer = new possibleProvider(this.dependencies);
          break;
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

  public translationEdit = async (e: MouseEvent, element: ElementWithMeta) => {
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
