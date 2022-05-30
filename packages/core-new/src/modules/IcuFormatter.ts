import IntlMessageFormat from 'intl-messageformat';
import { FormatFunction } from '..';

export const IcuFormatter = () => {
  const cache = new Map<string, IntlMessageFormat>();

  const format: FormatFunction = ({ translation, language, params }) => {
    const ignoreTag = !Object.values(params).find(
      (p) => typeof p === 'function'
    );

    return new IntlMessageFormat(translation, language, undefined, {
      ignoreTag,
    }).format(params) as string;
  };

  return Object.freeze({
    format,
  });
};

IcuFormatter.type = 'formatter';
