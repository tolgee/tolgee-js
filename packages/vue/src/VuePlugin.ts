import { TolgeePlugin } from '@tolgee/core';
import {
  ObserverOptions,
  DevTools,
  BrowserExtensionPlugin,
} from '@tolgee/devtools-web';

type Props = Partial<ObserverOptions>;

export const VuePlugin =
  (props?: Props): TolgeePlugin =>
  (tolgee) =>
    tolgee
      .use(BrowserExtensionPlugin({ noReload: true }))
      .use(DevTools({ observer: props }));
