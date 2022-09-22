import type { TolgeePlugin } from '@tolgee/core';
import type { TolgeeSvelteContext } from './types';

let globalContext: TolgeeSvelteContext | undefined;

export const GlobalContextPlugin = (): TolgeePlugin => (tolgee) => {
  globalContext = {
    tolgee,
  };
  return tolgee;
};

export function getGlobalContext() {
  return globalContext;
}
