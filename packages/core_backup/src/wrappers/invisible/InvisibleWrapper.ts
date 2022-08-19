import { Properties } from '../../Properties';
import { ElementRegistrar } from '../../services/ElementRegistrar';
import { TranslationParams } from '../../types';
import { NodeHandler } from '../NodeHandler';
import { AttributeHandler } from './AttributeHandler';
import { Coder } from './Coder';
import { CoreHandler } from './CoreHandler';
import { ContentHandler } from './ContentHandler';
import { WrappedHandler } from '../WrappedHandler';
import { AbstractWrapper } from '../AbstractWrapper';

export class InvisibleWrapper implements AbstractWrapper {
  private coder: Coder;
  private coreHandler: CoreHandler;
  private attributeHandler: AttributeHandler;
  private wrappedHandler: WrappedHandler;
  private textHandler: ContentHandler;
  private nodeHandler: any;
  constructor(properties: Properties, elementRegistrar: ElementRegistrar) {
    this.coder = new Coder();
    this.nodeHandler = new NodeHandler(properties, elementRegistrar, this);
    this.textHandler = new ContentHandler(this.nodeHandler);
    this.attributeHandler = new AttributeHandler(properties, this.nodeHandler);
    this.wrappedHandler = new WrappedHandler(
      elementRegistrar,
      this.nodeHandler
    );
    this.coreHandler = new CoreHandler(
      this.textHandler,
      this.attributeHandler,
      this.wrappedHandler
    );
  }

  public handleText(node: Element) {
    return this.textHandler.handle(node);
  }

  public handleSubtree(node: Element) {
    return this.coreHandler.handleSubtree(node);
  }

  public handleAttribute(node: Element) {
    return this.attributeHandler.handle(node);
  }

  public wrap(
    key: string,
    params: TranslationParams = {},
    defaultValue: string | undefined = undefined,
    translation = ''
  ) {
    return this.coder.wrap(key, params, defaultValue, translation);
  }

  public unwrap(text: string) {
    return this.coder.unwrap(text);
  }
}
