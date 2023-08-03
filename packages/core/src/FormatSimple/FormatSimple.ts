import { formatter } from './formatter';
import { FinalFormatterMiddleware, TolgeePlugin } from '../types';

function createFormatSimple(): FinalFormatterMiddleware {
  return {
    format: ({ translation, params }) => formatter(translation, params),
  };
}

export const FormatSimple = (): TolgeePlugin => (tolgee, tools) => {
  tools.addFormatter(createFormatSimple());
  return tolgee;
};
