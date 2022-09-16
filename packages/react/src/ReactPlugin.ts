import { TolgeePlugin, GlobalInstancePlugin } from '@tolgee/core';
import {
  ObserverOptions,
  DevTools,
  BrowserExtensionPlugin,
} from '@tolgee/devtools-web';

export const ReactPlugin =
  (observerOptions?: Partial<ObserverOptions>): TolgeePlugin =>
  (tolgee) =>
    tolgee
      .use(BrowserExtensionPlugin())
      .use(DevTools({ observer: observerOptions }))
      .use(GlobalInstancePlugin());
