import type { TolgeePlugin } from '@tolgee/core';
import type { ObserverOptions } from '@tolgee/devtools-web';
import { DevTools, BrowserExtensionPlugin } from '@tolgee/devtools-web';
import { GlobalContextPlugin } from './GlobalContextPlugin';

type Props = Partial<ObserverOptions>;

export const SveltePlugin =
  (props?: Props): TolgeePlugin =>
  (tolgee) =>
    tolgee
      .use(BrowserExtensionPlugin({ noReload: true }))
      .use(DevTools({ observer: props }))
      .use(GlobalContextPlugin());
