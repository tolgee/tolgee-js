import { TolgeePlugin } from '@tolgee/core';
import { createFormatIcu } from './createFormatIcu';

export const FormatIcu = (): TolgeePlugin => (tolgee, tools) => {
  tools.setFinalFormatter(createFormatIcu());
  return tolgee;
};
