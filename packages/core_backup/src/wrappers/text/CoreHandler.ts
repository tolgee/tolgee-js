import { NodeHelper } from '../../helpers/NodeHelper';
import { ContentHandler } from './ContentHandler';
import { EventService } from '../../services/EventService';
import { Properties } from '../../Properties';
import { AttributeHandler } from './AttributeHandler';
import { ElementWithMeta } from '../../types';
import { WrappedHandler } from '../WrappedHandler';
import { Coder } from './Coder';

export class CoreHandler {
  constructor(
    private textHandler: ContentHandler,
    private eventService: EventService,
    private properties: Properties,
    private attributeHandler: AttributeHandler,
    private coder: Coder,
    private wrappedHandler: WrappedHandler
  ) {
    if (typeof window !== 'undefined') {
      eventService.LANGUAGE_CHANGED.subscribe(this.refresh.bind(this));
      eventService.TRANSLATION_CHANGED.subscribe(this.refresh.bind(this));
    }
  }

  public async handleSubtree(target: Element) {
    await this.attributeHandler.handle(target);
    await this.textHandler.handle(target);
    await this.wrappedHandler.handle(target);
  }

  private async refresh() {
    const nodes: ElementWithMeta[] = NodeHelper.evaluate(
      `//*[@_tolgee]`,
      this.properties.config.targetElement
    );
    for (const node of nodes) {
      for (const textNode of node._tolgee.nodes) {
        const result = await this.coder.unwrap(textNode._tolgee.oldTextContent);
        if (result) {
          NodeHelper.setNodeText(textNode, result.text);
        }
      }
    }
  }
}
