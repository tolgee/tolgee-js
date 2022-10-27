import { TolgeePlugin, DevTools } from '@tolgee/web';

export const I18nextPlugin = (): TolgeePlugin => (tolgee) =>
  tolgee.use(DevTools()).init({ ns: [] });
