import { TolgeePlugin } from '@tolgee/core';
import { UI } from './ui/index';

export const ContextUi = (): TolgeePlugin => (tolgee, tools) => {
  tools.setUi(UI as any);
  return tolgee;
};
