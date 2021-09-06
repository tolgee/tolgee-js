import { TolgeeConfig } from './TolgeeConfig';
import { Scope } from './types';

const PREFERRED_LANGUAGES_LOCAL_STORAGE_KEY = '__tolgee_preferredLanguages';
const CURRENT_LANGUAGE_LOCAL_STORAGE_KEY = '__tolgee_currentLanguage';

export class Properties {
  config: TolgeeConfig;
  scopes?: Scope[];
  _currentLanguage?: string;

  get currentLanguage(): string {
    let result;

    if (this.config.forceLanguage) {
      return this.config.forceLanguage;
    }

    if (typeof localStorage !== 'undefined') {
      result = localStorage.getItem(CURRENT_LANGUAGE_LOCAL_STORAGE_KEY);

      if (this.config.availableLanguages) {
        const isSavedLanguageAvailable =
          this.config.availableLanguages.indexOf(result) > -1;
        if (!isSavedLanguageAvailable) {
          result = undefined;
        }
      }
    } else {
      result = this._currentLanguage;
    }

    if (!result) {
      result = this.getLanguageByNavigator();
      this.currentLanguage = result;
    }
    return result;
  }

  set currentLanguage(language: string) {
    if (typeof localStorage == 'undefined') {
      this._currentLanguage = language;
      return;
    }
    localStorage.setItem(CURRENT_LANGUAGE_LOCAL_STORAGE_KEY, language);
  }

  get preferredLanguages(): Set<string> {
    return new Set(
      JSON.parse(localStorage.getItem(PREFERRED_LANGUAGES_LOCAL_STORAGE_KEY))
    );
  }

  set preferredLanguages(languages: Set<string>) {
    localStorage.setItem(
      PREFERRED_LANGUAGES_LOCAL_STORAGE_KEY,
      JSON.stringify(Array.from(languages))
    );
  }

  private getLanguageByNavigator() {
    if (typeof window !== 'undefined' && this.config.availableLanguages) {
      const preferred = window.navigator.language;
      const exactMatch = this.config.availableLanguages.find(
        (l) => l === preferred
      );
      if (exactMatch) {
        return exactMatch;
      }

      const getTwoLetters = (fullTag) => fullTag.replace(/^(.+?)(-.*)?$/, '$1');

      const preferredTwoLetter = getTwoLetters(window.navigator.language);
      const twoLetterMatch = this.config.availableLanguages.find(
        (l) => getTwoLetters(l) === preferredTwoLetter
      );
      if (twoLetterMatch) {
        return twoLetterMatch;
      }
    }
    return this.config.defaultLanguage;
  }
}
