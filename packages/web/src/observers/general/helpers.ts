import { KeyDescriptorInternal } from '../../types';

export function xPathEvaluate<T extends Node>(
  expression: string,
  targetNode: Node
): Node[] {
  let node: Node | null;
  const evaluated = document?.evaluate(
    expression,
    targetNode,
    undefined,
    XPathResult.ANY_TYPE
  );
  const result: Node[] = [];
  while ((node = evaluated?.iterateNext?.())) {
    result.push(node as T);
  }
  return result;
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

export const compareDescriptors = (
  descriptor: KeyDescriptorInternal,
  criteria: KeyDescriptorInternal
) => {
  const keyMatches =
    descriptor.key === undefined ||
    criteria.key === undefined ||
    criteria.key === descriptor.key;
  const nsMatches =
    descriptor.ns === undefined ||
    criteria.ns === undefined ||
    descriptor.ns?.findIndex((ns) => criteria.ns?.includes(ns)) !== -1;

  return keyMatches && nsMatches;
};
