import { NodeHelper } from '../helpers/NodeHelper';
import { Properties } from '../Properties';
import { TranslationHighlighter } from '../highlighter/TranslationHighlighter';
import { TextService } from '../services/TextService';
import { AbstractHandler } from './AbstractHandler';
import { ElementRegistrar } from '../services/ElementRegistrar';
import { INVISIBLE_CHARACTERS } from '../helpers/secret';
import { TOLGEE_ATTRIBUTE_NAME } from 'Constants/Global';
import { NodeLock, NodeMeta } from 'types';
import { InvisibleTextService } from 'services/InvisibleTextService';

export class InvisibleTextHandler extends AbstractHandler {
  constructor(
    protected properties: Properties,
    protected translationHighlighter: TranslationHighlighter,
    protected textService: TextService,
    protected invisibleTextService: InvisibleTextService,
    protected nodeRegistrar: ElementRegistrar
  ) {
    super(properties, textService, nodeRegistrar, translationHighlighter);
  }

  async handle(node: Node): Promise<void> {
    const xPath = `./descendant-or-self::text()[contains(., '${INVISIBLE_CHARACTERS[0]}')]`;
    const nodes = NodeHelper.evaluate(xPath, node);
    const filtered: Text[] = this.filterRestricted(nodes as Text[]);

    await this.handleNodes(filtered);
  }

  protected async handleNodes(nodes: Array<Text | Attr>) {
    for (const textNode of nodes) {
      if (textNode[TOLGEE_ATTRIBUTE_NAME] === undefined) {
        textNode[TOLGEE_ATTRIBUTE_NAME] = {} as NodeLock;
      }
      const tolgeeData = textNode[TOLGEE_ATTRIBUTE_NAME] as
        | NodeMeta
        | NodeLock
        | undefined;
      if (tolgeeData?.locked !== true) {
        this.lockNode(textNode);
        const result = await this.invisibleTextService.replace(
          textNode.textContent
        );
        if (result) {
          const { text, keys } = result;
          const translatedNode = this.translateChildNode(textNode, text, keys);
          const parentElement = this.getParentElement(translatedNode);
          parentElement._tolgee.nodes.add(translatedNode);
          this.elementRegistrar.register(parentElement);
        }
        this.unlockNode(textNode);
      }
    }
  }
}
