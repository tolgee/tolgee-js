import { NodeHelper } from '../helpers/NodeHelper';
import { Properties } from '../Properties';
import { TranslationHighlighter } from '../highlighter/TranslationHighlighter';
import { TextService } from '../services/TextService';
import { AbstractHandler } from './AbstractHandler';
import { ElementRegistrar } from '../services/ElementRegistrar';
import { TOLGEE_WRAPPED_ONLY_DATA_ATTRIBUTE } from '../Constants/Global';

export class WrappedHandler extends AbstractHandler {
  constructor(
    protected properties: Properties,
    protected translationHighlighter: TranslationHighlighter,
    protected textService: TextService,
    protected elementRegistrar: ElementRegistrar
  ) {
    super(properties, textService, elementRegistrar, translationHighlighter);
  }

  async handle(node: Node): Promise<void> {
    const xPath = `./descendant-or-self::*[@${TOLGEE_WRAPPED_ONLY_DATA_ATTRIBUTE}]`;
    const nodes = NodeHelper.evaluate(xPath, node);
    const filtered: Element[] = this.filterRestricted(nodes as Element[]);
    filtered.forEach((element) => {
      const elementWithMeta = AbstractHandler.initParentElement(element);
      elementWithMeta._tolgee.wrappedWithElementOnlyKey = element.getAttribute(
        TOLGEE_WRAPPED_ONLY_DATA_ATTRIBUTE
      );
      elementWithMeta._tolgee.wrappedWithElementOnlyDefaultHtml =
        element.innerHTML;
      this.elementRegistrar.register(elementWithMeta);
    });
  }
}
