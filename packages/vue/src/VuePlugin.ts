import { TolgeePlugin, ObserverOptions, DevTools } from '@tolgee/web';

type Props = Partial<ObserverOptions>;

export const VuePlugin =
  (props?: Props): TolgeePlugin =>
  (tolgee) =>
    tolgee.use(DevTools({ observer: props }));
