import {
  ObserverOptions,
  TolgeeInstance,
  TolgeePlugin,
  GlobalInstancePlugin,
} from '@tolgee/core';
import { DevToolsPlugin } from '@tolgee/devtools-web';

export const ReactPlugin =
  (observerOptions?: Partial<ObserverOptions>): TolgeePlugin =>
  (tolgee: TolgeeInstance) =>
    tolgee.use(DevToolsPlugin(observerOptions)).use(GlobalInstancePlugin());
