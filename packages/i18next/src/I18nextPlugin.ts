import { TolgeePlugin } from '@tolgee/web';

export const I18nextPlugin = (): TolgeePlugin => (tolgee) => {
  tolgee.updateOptions({ loadRecordsOnRun: false });
  return tolgee;
};
