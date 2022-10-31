import type { TolgeePlugin } from '@tolgee/core';
import { InContextOptions } from './types';
import { InContextProduction } from './InContextProduction';
import { BrowserExtensionPlugin } from './BrowserExtensionPlugin/BrowserExtensionPlugin';

export const InContextTools =
  (props?: InContextOptions): TolgeePlugin =>
  (tolgee) => {
    tolgee.addPlugin(BrowserExtensionPlugin(props));
    tolgee.addPlugin(InContextProduction(props));
    return tolgee;
  };
