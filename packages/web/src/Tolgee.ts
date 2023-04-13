import { TolgeeCore, TolgeeChainer } from '@tolgee/core';
import { BrowserExtensionPlugin } from './BrowserExtensionPlugin/BrowserExtensionPlugin';

export function Tolgee(): TolgeeChainer {
  return TolgeeCore().use(BrowserExtensionPlugin());
}
