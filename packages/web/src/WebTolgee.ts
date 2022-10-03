import { Options, Tolgee as TolgeeCore, TolgeeInstance } from '@tolgee/core';
import { BrowserExtensionPlugin } from './BrowserExtensionPlugin/BrowserExtensionPlugin';

export const Tolgee = (options?: Partial<Options>): TolgeeInstance => {
  return TolgeeCore(options).use(BrowserExtensionPlugin());
};

export { TolgeeCore };
