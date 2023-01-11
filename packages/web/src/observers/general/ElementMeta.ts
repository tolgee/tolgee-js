import type { KeyAndParams } from '@tolgee/core';
import type { ElementMeta, NodeMeta } from '../../types';

export function initElementMeta(): ElementMeta {
  return {
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
