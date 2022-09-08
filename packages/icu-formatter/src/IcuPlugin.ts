import { TolgeePlugin } from '@tolgee/core';
import { IcuFormatter } from './IcuFormatter';

export const IcuPlugin = (): TolgeePlugin => (tolgee) => {
  tolgee.setFinalFormatter(IcuFormatter());
  return tolgee;
};
