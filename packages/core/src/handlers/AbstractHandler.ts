import { NodeHelper } from '../helpers/NodeHelper';
import { Properties } from '../Properties';
import {
  ElementMeta,
  ElementWithMeta,
  KeyAndParams,
  NodeLock,
  NodeMeta,
  NodeWithLock,
  NodeWithMeta,
} from '../types';
import { TextService } from '../services/TextService';
import { ElementRegistrar } from '../services/ElementRegistrar';
import { TranslationHighlighter } from '../highlighter/TranslationHighlighter';
import {
  RESTRICTED_ASCENDANT_ATTRIBUTE,
  TOLGEE_ATTRIBUTE_NAME,
} from '../Constants/Global';

export abstract class AbstractHandler {
  protected constructor(
    protected properties: Properties,
    protected textService: TextService,
    protected elementRegistrar: ElementRegistrar,
    protected translationHighlighter: TranslationHighlighter
  ) {}

  protected static initParentElement(element: Element): ElementWithMeta {
    if (element[TOLGEE_ATTRIBUTE_NAME] === undefined) {
      element[TOLGEE_ATTRIBUTE_NAME] = {
        nodes: new Set(),
      } as ElementMeta;
      element.setAttribute(TOLGEE_ATTRIBUTE_NAME, '');
    }

    return element as ElementWithMeta;
  }

  abstract handle(node: Node);

  protected filterRestricted<T extends Element | Text>(nodes: T[]) {
    const restrictedElements = this.properties.config.restrictedElements;
    return nodes.filter((n) => {
      const e = NodeHelper.closestElement(n);
      return (
        restrictedElements.indexOf(e.tagName.toLowerCase()) === -1 &&
        e.closest(`[${RESTRICTED_ASCENDANT_ATTRIBUTE}="true"]`) === null
      );
    });
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
        const result = await this.textService.replace(textNode.textContent);
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

  protected translateChildNode(
    node: Text | Attr,
    newValue,
    keys: KeyAndParams[]
  ) {
    node[TOLGEE_ATTRIBUTE_NAME] = {
      oldTextContent: node.textContent,
      keys,
    };
    node.textContent = newValue;
    return node as Node as NodeWithMeta;
  }

  private lockNode(node: Node | Attr): NodeWithLock {
    if (node[TOLGEE_ATTRIBUTE_NAME] === undefined) {
      node[TOLGEE_ATTRIBUTE_NAME] = {} as NodeLock;
    }

    const tolgeeData = node[TOLGEE_ATTRIBUTE_NAME] as NodeMeta | NodeLock;
    if (tolgeeData?.locked !== true) {
      tolgeeData.locked = true;
    }

    return node as NodeWithLock;
  }

  private unlockNode(node: Node | Attr) {
    if (node[TOLGEE_ATTRIBUTE_NAME]) {
      node[TOLGEE_ATTRIBUTE_NAME].locked = false;
    }
  }

  private getParentElement(node: Node) {
    const parent = this.getSuitableParent(node);
    return AbstractHandler.initParentElement(parent);
  }

  private getSuitableParent(node: Node): Element {
    const domParent = NodeHelper.getParentElement(node);

    if (domParent === undefined) {
      // eslint-disable-next-line no-console
      console.error(node);
      throw new Error('No suitable parent found for node above.');
    }

    if (!this.properties.config.passToParent) {
      return domParent;
    }

    if (Array.isArray(this.properties.config.passToParent)) {
      const tagNameEquals = (elementTagName: string) =>
        domParent.tagName.toLowerCase() === elementTagName.toLowerCase();
      if (this.properties.config.passToParent.findIndex(tagNameEquals) === -1) {
        return domParent;
      }
    }

    if (typeof this.properties.config.passToParent === 'function') {
      if (!this.properties.config.passToParent(domParent)) {
        return domParent;
      }
    }

    return this.getSuitableParent(domParent);
  }
}
