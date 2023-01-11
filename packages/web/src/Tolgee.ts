import { TolgeeCore, TolgeeChainer } from '@tolgee/core';
import { BrowserExtensionPlugin } from './BrowserExtensionPlugin/BrowserExtensionPlugin';

export const Tolgee: typeof TolgeeCore = (): TolgeeChainer => {
  return TolgeeCore().use(BrowserExtensionPlugin());
};
