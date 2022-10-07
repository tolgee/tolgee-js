import { formatter } from './formatter';
import { FinalFormatterInterface, TolgeePlugin } from '../types';

export function FormatSimpleCreator(): FinalFormatterInterface {
  return {
    format: ({ translation, params }) => formatter(translation, params),
  };
}

export const FormatSimple = (): TolgeePlugin => (tolgee, tools) => {
  tools.setFinalFormatter(FormatSimpleCreator());
  return tolgee;
};
