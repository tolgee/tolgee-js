import { formatter } from './formatter';
import { FinalFormatterInterface } from '../types';
import { TolgeePlugin } from '../types/plugin';

export function FormatSimpleCreator(): FinalFormatterInterface {
  return {
    format: ({ translation, params }) => formatter(translation, params),
  };
}

export const FormatSimple = (): TolgeePlugin => (tolgee, tools) => {
  tools.setFinalFormatter(FormatSimpleCreator());
  return tolgee;
};
