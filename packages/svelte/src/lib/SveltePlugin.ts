import {
  type TolgeePlugin,
  DevTools,
  type InContextOptions,
} from '@tolgee/web';
import { GlobalContextPlugin } from './GlobalContextPlugin';

export const SveltePlugin =
  (options?: InContextOptions): TolgeePlugin =>
  (tolgee) =>
    tolgee.use(DevTools(options)).use(GlobalContextPlugin());
