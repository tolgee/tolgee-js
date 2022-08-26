import {
  RESTRICTED_ASCENDANT_ATTRIBUTE,
  TOLGEE_ATTRIBUTE_NAME,
} from '../constants';
import {
  ElementMeta,
  ElementWithMeta,
  KeyAndParams,
  KeyAndParamsTags,
  NodeLock,
  NodeMeta,
  NodeWithLock,
  NodeWithMeta,
} from '../types';

export function xPathEvaluate<T extends Node>(
  expression: string,
  targetNode: Node
): Node[] {
  let node: Node | null;
  const evaluated = document.evaluate(
    expression,
    targetNode,
    undefined,
    XPathResult.ANY_TYPE
  );
  const result: Node[] = [];
  while ((node = evaluated.iterateNext()) !== null) {
    result.push(node as T);
  }
  return result;
}

export function filterRestricted<T extends Element | Text>(nodes: T[]) {
  const restrictedElements: string[] = [];
  return nodes.filter((n) => {
    const e = closestElement(n);
    if (!e) {
      return false;
    }
    return (
      restrictedElements.indexOf(e.tagName.toLowerCase()) === -1 &&
      e.closest(`[${RESTRICTED_ASCENDANT_ATTRIBUTE}="true"]`) === null
    );
  });
}

export function closestElement(node: Element | Text) {
  if (node instanceof Text) {
    return node.parentElement;
  }
  return node;
}

export function lockNode(node: Node | Attr): NodeWithLock {
  if ((node as any)[TOLGEE_ATTRIBUTE_NAME] === undefined) {
    (node as any)[TOLGEE_ATTRIBUTE_NAME] = {} as NodeLock;
  }

  const tolgeeData = (node as any)[TOLGEE_ATTRIBUTE_NAME] as
    | NodeMeta
    | NodeLock;
  if (tolgeeData?.locked !== true) {
    tolgeeData.locked = true;
  }

  return node as NodeWithLock;
}

export function unlockNode(node: Node | Attr) {
  if ((node as any)[TOLGEE_ATTRIBUTE_NAME]) {
    (node as any)[TOLGEE_ATTRIBUTE_NAME].locked = false;
  }
}

export function getNodeText(node: Node) {
  return node.textContent;
}

export function setNodeText(node: Node, text: string) {
  node.textContent = text;
}

export function translateChildNode(
  node: Text | Attr,
  newValue: string,
  keys: KeyAndParams[]
) {
  (node as any)[TOLGEE_ATTRIBUTE_NAME] = {
    oldTextContent: getNodeText(node),
    keys,
  };
  setNodeText(node, newValue);
  return node as Node as NodeWithMeta;
}

function initParentElement(element: Element): ElementWithMeta {
  if ((element as ElementWithMeta)[TOLGEE_ATTRIBUTE_NAME] === undefined) {
    (element as ElementWithMeta)[TOLGEE_ATTRIBUTE_NAME] = {
      nodes: new Set(),
    } as ElementMeta;
    element.setAttribute(TOLGEE_ATTRIBUTE_NAME, '');
  }

  return element as ElementWithMeta;
}

function getParentElement(node: Node): Element | undefined {
  if (node.parentElement) {
    return node.parentElement;
  }
  if ((node as Attr).ownerElement) {
    return (node as Attr).ownerElement || undefined;
  }
}

export function getAndInitParent(node: Node) {
  const parent = getSuitableParent(node);
  return initParentElement(parent);
}

export function getSuitableParent(node: Node): Element {
  const domParent = getParentElement(node);

  if (domParent === undefined) {
    // eslint-disable-next-line no-console
    console.error(node);
    throw new Error('No suitable parent found for node above.');
  }

  // if (!this.properties.config.passToParent) {
  return domParent;
  // }

  // if (Array.isArray(this.properties.config.passToParent)) {
  //   const tagNameEquals = (elementTagName: string) =>
  //     domParent.tagName.toLowerCase() === elementTagName.toLowerCase();
  //   if (this.properties.config.passToParent.findIndex(tagNameEquals) === -1) {
  //     return domParent;
  //   }
  // }

  // if (typeof this.properties.config.passToParent === 'function') {
  //   if (!this.properties.config.passToParent(domParent)) {
  //     return domParent;
  //   }
  // }

  // return getSuitableParent(domParent);
}
