import IntlMessageFormat from 'intl-messageformat';
import { TolgeeModule } from '../types';
export const IcuFormatter: TolgeeModule = class {
  static type = 'formatter' as const;

  cache = new Map<string, IntlMessageFormat>();

  format({ translation, language, params }) {
    const ignoreTag = !Object.values(params).find(
      (p) => typeof p === 'function'
    );

    return new IntlMessageFormat(translation, language, undefined, {
      ignoreTag,
    }).format(params) as string;
  }
};
