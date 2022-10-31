import { TolgeePlugin, DevTools } from '@tolgee/web';

export const NgxPlugin = (): TolgeePlugin => (tolgee) => {
  return tolgee.use(DevTools());
};
