import { NodeHelper } from '../helpers/NodeHelper';
import { NodeHandler } from './NodeHandler';
import { ElementRegistrar } from '../services/ElementRegistrar';
import { TOLGEE_WRAPPED_ONLY_DATA_ATTRIBUTE } from '../Constants/Global';

export class WrappedHandler {
  constructor(
    private elementRegistrar: ElementRegistrar,
    private nodeHandler: NodeHandler
  ) {}

  async handle(node: Node): Promise<void> {
    const xPath = `./descendant-or-self::*[@${TOLGEE_WRAPPED_ONLY_DATA_ATTRIBUTE}]`;
    const nodes = NodeHelper.evaluate(xPath, node);
    const filtered: Element[] = this.nodeHandler.filterRestricted(
      nodes as Element[]
    );
    filtered.forEach((element) => {
      const elementWithMeta = NodeHandler.initParentElement(element);
      elementWithMeta._tolgee.wrappedWithElementOnlyKey = element.getAttribute(
        TOLGEE_WRAPPED_ONLY_DATA_ATTRIBUTE
      );
      elementWithMeta._tolgee.wrappedWithElementOnlyDefaultHtml =
        element.innerHTML;
      this.elementRegistrar.register(elementWithMeta);
    });
  }
}
