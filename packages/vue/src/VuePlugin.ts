import { type TolgeePlugin, DevTools, InContextOptions } from '@tolgee/web';
import { GlobalContextPlugin } from './GlobalContextPlugin';

export const VuePlugin =
  (options?: InContextOptions): TolgeePlugin =>
  (tolgee) => {
    tolgee.addPlugin(DevTools(options));
    tolgee.addPlugin(GlobalContextPlugin());
    return tolgee;
  };
