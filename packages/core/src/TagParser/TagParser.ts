import { FinalFormatterMiddleware, TolgeePlugin } from '../types';
import { parser } from './parser';

function createTagParser(): FinalFormatterMiddleware {
  return {
    format: ({ translation, params }) => parser(translation, params),
  };
}

export const TagParser = (): TolgeePlugin => (tolgee, tools) => {
  tools.setFinalFormatter(createTagParser());
  return tolgee;
};
