import { CoreService } from '../services/CoreService';
import { ElementWithMeta } from '../types';
import { Lifecycle, scoped } from 'tsyringe';
import { Properties } from '../Properties';
import { EventService } from '../services/EventService';
import { TranslationService } from '../services/TranslationService';
import { MouseEventHandler } from './MouseEventHandler';

@scoped(Lifecycle.ContainerScoped)
export class TranslationHighlighter {
  private _renderer: any;

  constructor(
    private service: CoreService,
    private properties: Properties,
    private eventService: EventService,
    private translationService: TranslationService,
    private mouseEventHandler: MouseEventHandler
  ) {}

  listen(element: ElementWithMeta & ElementCSSInlineStyle) {
    this.mouseEventHandler.handle(
      element,
      async (e) => await this.translationEdit(e, element)
    );
  }

  private async getKey(
    mouseEvent: MouseEvent,
    element: ElementWithMeta
  ): Promise<string> {
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

  private static getKeyOptions(node: ElementWithMeta): Set<string> {
    const nodes = Array.from(node._tolgee.nodes);
    const keys = nodes.reduce(
      (acc, curr) => [...acc, ...curr._tolgee.keys.map((k) => k.key)],
      []
    );
    return new Set(keys);
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

  private get renderer() {
    if (this._renderer === undefined) {
      if (typeof this.properties.config.ui === 'function') {
        this._renderer = new this.properties.config.ui({
          coreService: this.service,
          properties: this.properties,
          eventService: this.eventService,
          translationService: this.translationService,
        });
      }
    }
    return this._renderer;
  }
}
