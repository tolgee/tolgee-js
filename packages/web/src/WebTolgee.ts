import {
  TolgeeOptions,
  Tolgee as TolgeeCore,
  TolgeeInstance,
} from '@tolgee/core';
import { BrowserExtensionPlugin } from './BrowserExtensionPlugin/BrowserExtensionPlugin';

export const Tolgee = (options?: Partial<TolgeeOptions>): TolgeeInstance => {
  return TolgeeCore(options).use(BrowserExtensionPlugin()).init();
};

export { TolgeeCore };
