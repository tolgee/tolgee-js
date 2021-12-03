import IntlMessageFormat from 'intl-messageformat';
import { TolgeeModule } from '../types';
export const IcuFormatter: TolgeeModule = class {
  static type = 'formatter' as const;
  format({ translation, language, params }) {
    return new IntlMessageFormat(translation, language).format(
      params
    ) as string;
  }
};
