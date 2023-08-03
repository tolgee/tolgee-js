import {
  FinalFormatterMiddleware,
  TolgeePlugin,
  ParamsFormatterMiddleware,
  TranslateParams,
} from '@tolgee/core';
import { parser } from './parser';
import { tagEscape } from './tagEscape';

function createParamsEscaper(): ParamsFormatterMiddleware {
  return {
    format({ params }) {
      const result: TranslateParams = {};
      Object.entries(params).forEach(([key, value]) => {
        if (typeof value === 'string') {
          result[key] = tagEscape(value);
        } else {
          result[key] = value;
        }
      });
      return result;
    },
  };
}

function createTagParser(escapeHtml: boolean): FinalFormatterMiddleware {
  return {
    format: ({ translation, params }) =>
      parser(translation, params, escapeHtml),
  };
}

type Options = {
  escapeParams?: boolean;
  escapeHtml?: boolean;
};

export const TagParser =
  (options?: Options): TolgeePlugin =>
  (tolgee, tools) => {
    if (options?.escapeParams ?? true) {
      tools.addParamsFormatter(createParamsEscaper());
    }
    tools.setFinalFormatter(createTagParser(Boolean(options?.escapeHtml)));
    return tolgee;
  };
