import { TolgeePlugin, DevTools } from '@tolgee/web';

export const NgxPlugin = (): TolgeePlugin => (tolgee) => {
  tolgee.addPlugin(DevTools());
  return tolgee;
};
