import { TolgeeConfig } from './TolgeeConfig';
import { Scope } from './types';

const PREFERRED_LANGUAGES_LOCAL_STORAGE_KEY = '__tolgee_preferredLanguages';
const CURRENT_LANGUAGE_LOCAL_STORAGE_KEY = '__tolgee_currentLanguage';

export class Properties {
  config: TolgeeConfig;
  scopes?: Scope[];
  projectId?: number;
  _currentLanguage?: string;

  get currentLanguage(): string {
    if (this.config?.forceLanguage) {
      return this.config.forceLanguage;
    }

    if (this._currentLanguage) {
      return this._currentLanguage;
    }

    if (this.config.languageStore) {
      const storedLanguage = this.getStoredLanguage();
      if (storedLanguage) {
        return storedLanguage;
      }
    }

    if (this.config.languageDetect) {
      const detectedLanguage = this.getLanguageByNavigator();
      if (detectedLanguage) {
        return detectedLanguage;
      }
    }

    return this.config.defaultLanguage;
  }

  set currentLanguage(language: string) {
    if (!language) {
      throw new Error(`Setting invalid language value ${language}`);
    }
    this._currentLanguage = language;

    if (this.config?.languageStore && typeof localStorage !== 'undefined') {
      localStorage.setItem(CURRENT_LANGUAGE_LOCAL_STORAGE_KEY, language);
    }
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

  private getStoredLanguage() {
    if (typeof localStorage !== 'undefined') {
      const storedLanguage = localStorage.getItem(
        CURRENT_LANGUAGE_LOCAL_STORAGE_KEY
      );

      if (!this.config.availableLanguages) {
        return storedLanguage;
      }

      const isSavedLanguageAvailable =
        this.config.availableLanguages.indexOf(storedLanguage) > -1;

      if (isSavedLanguageAvailable) {
        return storedLanguage;
      }
    }
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
  }
}
