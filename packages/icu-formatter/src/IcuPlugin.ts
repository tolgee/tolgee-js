import { TolgeePlugin } from '@tolgee/core';
import { IcuFormatter } from './IcuFormatter';

export const IcuPlugin = (): TolgeePlugin => (tolgee, tools) => {
  tools.setFinalFormatter(IcuFormatter());
  return tolgee;
};
