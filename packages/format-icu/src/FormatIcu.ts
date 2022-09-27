import { TolgeePlugin } from '@tolgee/core';
import { IcuFormatter } from './IcuFormatter';

export const FormatIcu = (): TolgeePlugin => (tolgee, tools) => {
  tools.setFinalFormatter(IcuFormatter());
  return tolgee;
};
