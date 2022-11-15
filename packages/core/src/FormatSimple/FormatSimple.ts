import { formatter } from './formatter';
import { FinalFormatterInterface, TolgeePlugin } from '../types';

function createFormatSimple(): FinalFormatterInterface {
  return {
    format: ({ translation, params }) => formatter(translation, params),
  };
}

export const FormatSimple = (): TolgeePlugin => (tolgee, tools) => {
  tools.setFinalFormatter(createFormatSimple());
  return tolgee;
};
