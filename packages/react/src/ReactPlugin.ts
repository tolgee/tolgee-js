import { TolgeePlugin } from '@tolgee/core';
import {
  ObserverOptions,
  DevTools,
  BrowserExtensionPlugin,
} from '@tolgee/devtools-web';
import { GlobalContextPlugin } from './GlobalContextPlugin';
import { ReactOptions } from './types';

type Props = Partial<ObserverOptions> & Partial<ReactOptions>;

export const ReactPlugin =
  (props?: Props): TolgeePlugin =>
  (tolgee) =>
    tolgee
      .use(BrowserExtensionPlugin())
      .use(DevTools({ observer: props }))
      .use(GlobalContextPlugin(props));
