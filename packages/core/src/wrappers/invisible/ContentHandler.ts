import { NodeHelper } from '../../helpers/NodeHelper';
import { INVISIBLE_CHARACTERS } from '../../helpers/secret';
import { NodeHandler } from '../NodeHandler';

export class ContentHandler {
  constructor(private nodeHandler: NodeHandler) {}

  async handle(node: Node): Promise<void> {
    const xPath = `./descendant-or-self::text()[contains(., '${INVISIBLE_CHARACTERS[0]}')]`;
    const nodes = NodeHelper.evaluate(xPath, node);
    const filtered: Text[] = this.nodeHandler.filterRestricted(nodes as Text[]);

    await this.nodeHandler.handleNodes(filtered);
  }
}
