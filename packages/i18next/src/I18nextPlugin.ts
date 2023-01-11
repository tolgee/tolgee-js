import { TolgeePlugin } from '@tolgee/web';

export const I18nextPlugin = (): TolgeePlugin => (tolgee) => {
  tolgee.updateOptions({ ns: [] });
  return tolgee;
};
