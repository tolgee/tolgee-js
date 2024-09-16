import type { TolgeePlugin } from '@tolgee/web';
import type { TolgeeVueContext } from './types';

let globalContext: TolgeeVueContext | undefined;

export const GlobalContextPlugin = (): TolgeePlugin => (tolgee) => {
  globalContext = {
    tolgee,
    isInitialRender: false,
  };
  return tolgee;
};

export function getGlobalContext() {
  return globalContext;
}
