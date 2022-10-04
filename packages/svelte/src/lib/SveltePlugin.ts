import { type TolgeePlugin, DevTools } from '@tolgee/web';
import { GlobalContextPlugin } from './GlobalContextPlugin';

export const SveltePlugin = (): TolgeePlugin => (tolgee) =>
  tolgee.use(DevTools()).use(GlobalContextPlugin());
