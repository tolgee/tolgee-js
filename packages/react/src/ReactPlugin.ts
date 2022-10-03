import { TolgeePlugin } from '@tolgee/web';
import { ObserverOptions, DevTools } from '@tolgee/web';
import { GlobalContextPlugin } from './GlobalContextPlugin';
import { ReactOptions } from './types';

type Props = Partial<ObserverOptions> & Partial<ReactOptions>;

export const ReactPlugin =
  (props?: Props): TolgeePlugin =>
  (tolgee) =>
    tolgee.use(DevTools({ observer: props })).use(GlobalContextPlugin(props));
