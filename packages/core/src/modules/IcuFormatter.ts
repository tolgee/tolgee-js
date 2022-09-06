import IntlMessageFormat from 'intl-messageformat';
import { TolgeeModule } from '../types';
export const IcuFormatter: TolgeeModule = class {
  static type = 'formatter' as const;

  private locales = new Map() as Map<string, string>;

  isLocaleValid(locale: string) {
    try {
      return Boolean(Intl.NumberFormat.supportedLocalesOf(locale).length);
    } catch {
      return false;
    }
  }

  getLocale(language: string) {
    if (!this.locales.get(language)) {
      let localeCandidate: string = String(language).replace(/[^a-zA-Z]/g, '-');
      while (!this.isLocaleValid(localeCandidate)) {
        localeCandidate =
          localeCandidate.split('-').slice(0, -1).join('-') || 'en';
      }
      this.locales.set(language, localeCandidate);
    }
    return this.locales.get(language);
  }

  format({ translation, language, params }) {
    const ignoreTag = !Object.values(params).find(
      (p) => typeof p === 'function'
    );

    const locale = this.getLocale(language);

    return new IntlMessageFormat(translation, locale, undefined, {
      ignoreTag,
    }).format(params) as string;
  }
};
