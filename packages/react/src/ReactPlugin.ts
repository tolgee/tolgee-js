import { TolgeePlugin, InContextOptions } from '@tolgee/web';
import { DevTools } from '@tolgee/web';
import { GlobalContextPlugin } from './GlobalContextPlugin';
import { ReactOptions } from './types';

type Props = Partial<ReactOptions> & InContextOptions;

export const ReactPlugin =
  (props?: Props): TolgeePlugin =>
  (tolgee) => {
    const { useSuspense, ...observerOptions } = props || {};
    tolgee.addPlugin(DevTools(observerOptions));
    tolgee.addPlugin(GlobalContextPlugin({ useSuspense }));
    return tolgee;
  };
