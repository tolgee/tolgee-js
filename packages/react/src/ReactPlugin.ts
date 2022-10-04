import { TolgeePlugin } from '@tolgee/web';
import { DevTools } from '@tolgee/web';
import { GlobalContextPlugin } from './GlobalContextPlugin';
import { ReactOptions } from './types';

type Props = Partial<ReactOptions>;

export const ReactPlugin =
  (props?: Props): TolgeePlugin =>
  (tolgee) =>
    tolgee.use(DevTools()).use(GlobalContextPlugin(props));
