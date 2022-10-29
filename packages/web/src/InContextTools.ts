import type { TolgeePlugin } from '@tolgee/core';
import { InContextOptions } from './types';
import { InContextProduction } from './InContextProduction';
import { BrowserExtensionPlugin } from './BrowserExtensionPlugin/BrowserExtensionPlugin';

export const InContextTools =
  (props?: InContextOptions): TolgeePlugin =>
  (tolgee) => {
    tolgee.use(BrowserExtensionPlugin(props));
    tolgee.use(InContextProduction(props));
    return tolgee;
  };
