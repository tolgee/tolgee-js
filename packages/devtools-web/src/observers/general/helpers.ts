import { RESTRICTED_ASCENDANT_ATTRIBUTE } from '@tolgee/core';

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

export function getNodeText(node: Node) {
  return node.textContent;
}

export function setNodeText(node: Node, text: string) {
  node.textContent = text;
}

export function nodeContains(descendant: Node, node: Node) {
  if (descendant.contains(node)) {
    return true;
  }
  if (node instanceof Attr) {
    const ownerContainsAttr =
      node.ownerElement &&
      Object.values(node.ownerElement.attributes).indexOf(node) > -1;
    if (descendant.contains(node.ownerElement) && ownerContainsAttr) {
      return true;
    }
  }
  return false;
}
