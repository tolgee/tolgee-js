import { NodeHelper } from '../helpers/NodeHelper';
import { Properties } from '../Properties';
import { TranslationHighlighter } from '../highlighter/TranslationHighlighter';
import { TextService } from '../services/TextService';
import { AbstractHandler } from './AbstractHandler';
import { ElementRegistrar } from '../services/ElementRegistrar';

export class TextHandler extends AbstractHandler {
  constructor(
    protected properties: Properties,
    protected translationHighlighter: TranslationHighlighter,
    protected textService: TextService,
    protected nodeRegistrar: ElementRegistrar
  ) {
    super(properties, textService, nodeRegistrar, translationHighlighter);
  }

  async handle(node: Node): Promise<void> {
    const inputPrefix = this.properties.config.inputPrefix;
    const inputSuffix = this.properties.config.inputSuffix;

    const xPath = `./descendant-or-self::text()[contains(., '${inputPrefix}') and contains(., '${inputSuffix}')]`;
    const nodes = NodeHelper.evaluate(xPath, node);
    const filtered: Text[] = this.filterRestricted(nodes as Text[]);

    await this.handleNodes(filtered);
  }
}
