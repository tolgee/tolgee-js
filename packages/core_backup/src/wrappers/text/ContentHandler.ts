import { NodeHelper } from '../../helpers/NodeHelper';
import { Properties } from '../../Properties';
import { NodeHandler } from '../NodeHandler';

export class ContentHandler {
  constructor(
    private properties: Properties,
    private nodeHandler: NodeHandler
  ) {}

  async handle(node: Node): Promise<void> {
    const inputPrefix = this.properties.config.inputPrefix;
    const inputSuffix = this.properties.config.inputSuffix;

    const xPath = `./descendant-or-self::text()[contains(., '${inputPrefix}') and contains(., '${inputSuffix}')]`;
    const nodes = NodeHelper.evaluate(xPath, node);
    const filtered: Text[] = this.nodeHandler.filterRestricted(nodes as Text[]);

    await this.nodeHandler.handleNodes(filtered);
  }
}
