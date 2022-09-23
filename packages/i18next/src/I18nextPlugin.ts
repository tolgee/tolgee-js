import { TolgeePlugin } from '@tolgee/core';
import {
  ObserverOptions,
  DevTools,
  BrowserExtensionPlugin,
} from '@tolgee/devtools-web';

type Props = Partial<ObserverOptions>;

export const I18nextPlugin =
  (props?: Props): TolgeePlugin =>
  (tolgee) =>
    tolgee
      .use(BrowserExtensionPlugin({ fullReload: true }))
      .use(DevTools({ observer: props }))
      .init({ ns: [] });
