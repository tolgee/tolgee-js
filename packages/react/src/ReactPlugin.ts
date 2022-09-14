import { TolgeePlugin, GlobalInstancePlugin } from '@tolgee/core';
import { ObserverOptions, DevTools } from '@tolgee/devtools-web';

export const ReactPlugin =
  (observerOptions?: Partial<ObserverOptions>): TolgeePlugin =>
  (tolgee) =>
    tolgee.use(DevTools(observerOptions)).use(GlobalInstancePlugin());
