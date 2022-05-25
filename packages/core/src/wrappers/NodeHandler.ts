import { NodeHelper } from '../helpers/NodeHelper';
import { Properties } from '../Properties';
import {
  ElementMeta,
  ElementWithMeta,
  KeyAndParamsTags,
  NodeLock,
  NodeMeta,
  NodeWithLock,
  NodeWithMeta,
} from '../types';
import { ElementRegistrar } from '../services/ElementRegistrar';
import {
  RESTRICTED_ASCENDANT_ATTRIBUTE,
  TOLGEE_ATTRIBUTE_NAME,
} from '../Constants/Global';
import { AbstractWrapper } from './AbstractWrapper';

export class NodeHandler {
  constructor(
    private properties: Properties,
    private elementRegistrar: ElementRegistrar,
    private wrapper: AbstractWrapper
  ) {}

  static initParentElement(element: Element): ElementWithMeta {
    if (element[TOLGEE_ATTRIBUTE_NAME] === undefined) {
      element[TOLGEE_ATTRIBUTE_NAME] = {
        nodes: new Set(),
      } as ElementMeta;
      element.setAttribute(TOLGEE_ATTRIBUTE_NAME, '');
    }

    return element as ElementWithMeta;
  }

  filterRestricted<T extends Element | Text>(nodes: T[]) {
    const restrictedElements = this.properties.config.restrictedElements;
    return nodes.filter((n) => {
      const e = NodeHelper.closestElement(n);
      if (!e) {
        return false;
      }
      return (
        restrictedElements.indexOf(e.tagName.toLowerCase()) === -1 &&
        e.closest(`[${RESTRICTED_ASCENDANT_ATTRIBUTE}="true"]`) === null
      );
    });
  }

  async handleNodes(nodes: Array<Text | Attr>) {
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
        const result = await this.wrapper.unwrap(
          NodeHelper.getNodeText(textNode)
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

  translateChildNode(
    node: Text | Attr,
    newValue,
    keys: KeyAndParamsTags<any>[]
  ) {
    node[TOLGEE_ATTRIBUTE_NAME] = {
      oldTextContent: NodeHelper.getNodeText(node),
      keys,
    };
    NodeHelper.setNodeText(node, newValue);
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
    return NodeHandler.initParentElement(parent);
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
