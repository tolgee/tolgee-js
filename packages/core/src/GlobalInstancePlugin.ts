import type { TolgeeInstance, TolgeePlugin } from './types';

let tolgeeGlobal: TolgeeInstance | undefined;

export const GlobalInstancePlugin = (): TolgeePlugin => (tolgee) => {
  tolgeeGlobal = tolgee;
  return tolgee;
};

export function getGlobalInstance() {
  return tolgeeGlobal;
}
