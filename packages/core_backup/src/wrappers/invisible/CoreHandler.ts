import { ContentHandler } from './ContentHandler';
import { AttributeHandler } from './AttributeHandler';
import { WrappedHandler } from '../WrappedHandler';

export class CoreHandler {
  constructor(
    private textHandler: ContentHandler,
    private attributeHandler: AttributeHandler,
    private wrappedHandler: WrappedHandler
  ) {}

  public async handleSubtree(target: Element) {
    await this.attributeHandler.handle(target);
    await this.textHandler.handle(target);
    await this.wrappedHandler.handle(target);
  }
}
