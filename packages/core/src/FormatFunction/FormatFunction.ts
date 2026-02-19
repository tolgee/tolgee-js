import { formatter } from './formatter';
import { FinalFormatterMiddleware, TolgeePlugin } from '../types';

function createFormatFunction(): FinalFormatterMiddleware {
  return {
    format: ({ translation, params }) => formatter(translation, params),
  };
}

export const FormatFunction = (): TolgeePlugin => (tolgee, tools) => {
  tools.setFinalFormatter(createFormatFunction());
  return tolgee;
};
