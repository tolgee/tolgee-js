import type { KeyAndParams } from '@tolgee/core';
import type { ElementMeta, NodeMeta, TolgeeElement } from '../../types';

export function initElementMeta(element: TolgeeElement): ElementMeta {
  return {
    element,
    nodes: new Map(),
  };
}

export function initNodeMeta(
  oldTextContent: string,
  keys: KeyAndParams[]
): NodeMeta {
  return {
    oldTextContent,
    keys,
  };
}
