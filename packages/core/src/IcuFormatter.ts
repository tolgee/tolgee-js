import IntlMessageFormat from 'intl-messageformat';
import { FormatterPlugin } from './types';

type Props = {
  translation: string;
  language: string;
  params: Record<string, any> | undefined;
};

export const IcuFormatter: FormatterPlugin = {
  format({ translation, language, params }: Props) {
    const ignoreTag =
      params && !Object.values(params).find((p) => typeof p === 'function');

    return new IntlMessageFormat(translation, language, undefined, {
      ignoreTag,
    }).format(params) as string;
  },
};
