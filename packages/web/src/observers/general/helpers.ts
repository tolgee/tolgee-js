import { KeyDescriptorInternal } from '../../types';

export function xPathEvaluate<T extends Node>(
  expression: string,
  targetNode: Node
): Node[] {
  const searchableElement = closestElement(targetNode);

  const result: Node[] = [];
  if (!searchableElement) {
    return result;
  }

  const evaluated = document?.evaluate(
    expression,
    searchableElement,
    undefined,
    XPathResult.ANY_TYPE
  );

  let node: Node | null | undefined;
  while ((node = evaluated?.iterateNext?.())) {
    result.push(node as T);
  }
  return result;
}

export function closestElement(node: Node): Element | undefined {
  switch (node.nodeType) {
    case Node.ATTRIBUTE_NODE:
      return (node as Attr).ownerElement || undefined;
    case Node.TEXT_NODE:
      return (node.parentElement as Element) || undefined;
    case Node.DOCUMENT_NODE:
    case Node.ELEMENT_NODE:
      return node as Element;
    default:
      // we are not interested in other nodes
      return undefined;
  }
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
