import { NodeHandler } from '../NodeHandler';
import { Properties } from '../../Properties';
import { NodeHelper } from '../../helpers/NodeHelper';

export class AttributeHandler {
  constructor(
    private properties: Properties,
    private nodeHandler: NodeHandler
  ) {}

  async handle(node: Element) {
    const inputPrefix = this.properties.config.inputPrefix;
    const inputSuffix = this.properties.config.inputSuffix;

    for (const [tag, attributes] of Object.entries(
      this.properties.config.tagAttributes
    )) {
      for (const attribute of attributes) {
        const expression = `descendant-or-self::${tag}/@${attribute}[contains(., '${inputPrefix}') and contains(., '${inputSuffix}')]`;
        const nodes: Array<Attr | Text> = NodeHelper.evaluate(expression, node);
        await this.nodeHandler.handleNodes(nodes);
      }
    }
  }
}
