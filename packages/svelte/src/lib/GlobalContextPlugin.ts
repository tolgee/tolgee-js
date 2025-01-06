import type { TolgeePlugin } from '@tolgee/web';
import type { TolgeeSvelteContext } from './types';

let globalContext: TolgeeSvelteContext | undefined;

export const GlobalContextPlugin = (): TolgeePlugin => (tolgee) => {
  globalContext = {
    tolgee
  };
  return tolgee;
};

export function getGlobalContext() {
  return globalContext;
}
