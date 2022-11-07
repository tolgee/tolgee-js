import { TolgeePlugin, DevTools } from '@tolgee/web';

export const I18nextPlugin = (): TolgeePlugin => (tolgee) => {
  tolgee.addPlugin(DevTools());
  tolgee.updateOptions({ ns: [] });
  return tolgee;
};
