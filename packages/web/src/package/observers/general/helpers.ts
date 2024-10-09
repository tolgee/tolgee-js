import { KeyDescriptorInternal } from '../../types';

export function getNodeText(node: Node) {
  return node.textContent;
}

export function setNodeText(node: Node, text: string) {
  node.textContent = text;
}

export function compareDescriptors(
  descriptor: KeyDescriptorInternal,
  criteria: KeyDescriptorInternal
) {
  const keyMatches =
    descriptor.key === undefined ||
    criteria.key === undefined ||
    criteria.key === descriptor.key;
  const nsMatches =
    descriptor.ns === undefined ||
    criteria.ns === undefined ||
    descriptor.ns?.findIndex((ns) => criteria.ns?.includes(ns)) !== -1;

  return keyMatches && nsMatches;
}

export function elementClickable(el: HTMLElement) {
  while (el) {
    if (el.getAttribute('disabled') !== null) {
      return false;
    }
    el = el.parentElement;
  }
  return true;
}
