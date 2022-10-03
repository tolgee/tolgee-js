import { type TolgeePlugin, type ObserverOptions, DevTools } from '@tolgee/web';
import { GlobalContextPlugin } from './GlobalContextPlugin';

type Props = Partial<ObserverOptions>;

export const SveltePlugin =
  (props?: Props): TolgeePlugin =>
  (tolgee) =>
    tolgee.use(DevTools({ observer: props })).use(GlobalContextPlugin());
