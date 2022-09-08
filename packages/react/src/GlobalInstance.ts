import { TolgeeInstance, TolgeePlugin } from '@tolgee/core';

let tolgeeGlobal: TolgeeInstance | undefined;

export const GlobalInstance: TolgeePlugin = (tolgee) => {
  tolgeeGlobal = tolgee;
};

export function getGlobalInstance() {
  return tolgeeGlobal;
}
