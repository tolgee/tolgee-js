import { TolgeePlugin, DevTools, BrowserExtensionPlugin } from '@tolgee/web';

export const I18nextPlugin = (): TolgeePlugin => (tolgee) =>
  tolgee.use(BrowserExtensionPlugin()).use(DevTools()).init({ ns: [] });
