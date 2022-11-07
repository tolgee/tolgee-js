import { TolgeePlugin } from '@tolgee/core';
import { FormatIcuCreator } from './FormatIcuCreator';

export const FormatIcu = (): TolgeePlugin => (tolgee, tools) => {
  tools.setFinalFormatter(FormatIcuCreator());
  return tolgee;
};
