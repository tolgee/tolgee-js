import { FinalFormatterMiddleware, TolgeePlugin } from '@tolgee/core';
import { htmlEscape } from './htmlEscape';

function createTranslationEscaper(): FinalFormatterMiddleware {
  return {
    format: ({ translation }) => htmlEscape(translation),
  };
}

export const HtmlEscaper = (): TolgeePlugin => (tolgee, tools) => {
  tools.setFinalFormatter(createTranslationEscaper());
  return tolgee;
};
