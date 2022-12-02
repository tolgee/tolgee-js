import type { LanguageDetectorMiddleware, TolgeePlugin } from '@tolgee/core';
import { throwIfSSR } from './tools/isSSR';

export const createLanguageDetector = (): LanguageDetectorMiddleware => {
  return {
    getLanguage({ availableLanguages }) {
      throwIfSSR('LanguageDetector');
      const preferred = window.navigator.language;
      const exactMatch = availableLanguages.find((l) => l === preferred);
      if (exactMatch) {
        return exactMatch;
      }

      const getTwoLetters = (fullTag: string) =>
        fullTag.replace(/^(.+?)(-.*)?$/, '$1');

      const preferredTwoLetter = getTwoLetters(window.navigator.language);
      const twoLetterMatch = availableLanguages.find(
        (l) => getTwoLetters(l) === preferredTwoLetter
      );
      if (twoLetterMatch) {
        return twoLetterMatch;
      }
      return undefined;
    },
  };
};

export const LanguageDetector = (): TolgeePlugin => (tolgee, tools) => {
  tools.setLanguageDetector(createLanguageDetector());
  return tolgee;
};
