import { NodeHandler } from '../NodeHandler';
import { Properties } from '../../Properties';
import { NodeHelper } from '../../helpers/NodeHelper';
import { INVISIBLE_CHARACTERS } from '../../helpers/secret';

export class AttributeHandler {
  constructor(
    private properties: Properties,
    private nodeHandler: NodeHandler
  ) {}

  async handle(node: Element) {
    for (const [tag, attributes] of Object.entries(
      this.properties.config.tagAttributes
    )) {
      for (const attribute of attributes) {
        const expression = `descendant-or-self::${tag}/@${attribute}[contains(., '${INVISIBLE_CHARACTERS[0]}')]`;
        const nodes: Array<Attr | Text> = NodeHelper.evaluate(expression, node);
        await this.nodeHandler.handleNodes(nodes);
      }
    }
  }
}
