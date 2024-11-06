import type { LanguageDetectorMiddleware, TolgeePlugin } from '@tolgee/core';
import { throwIfSSR } from './tools/isSSR';

export function detectLanguage(language: string, availableLanguages: string[]) {
  const exactMatch = availableLanguages.find((l) => l === language);
  if (exactMatch) {
    return exactMatch;
  }

  const getTwoLetters = (fullTag: string) =>
    fullTag.replace(/^(.+?)(-.*)?$/, '$1');

  const preferredTwoLetter = getTwoLetters(language);
  const twoLetterMatch = availableLanguages.find(
    (l) => getTwoLetters(l) === preferredTwoLetter
  );
  if (twoLetterMatch) {
    return twoLetterMatch;
  }
  return undefined;
}

export function createLanguageDetector(): LanguageDetectorMiddleware {
  return {
    getLanguage({ availableLanguages }) {
      throwIfSSR('LanguageDetector');
      const preferred = window.navigator.language;
      return detectLanguage(preferred, availableLanguages);
    },
  };
}

export const LanguageDetector = (): TolgeePlugin => (tolgee, tools) => {
  tools.setLanguageDetector(createLanguageDetector());
  return tolgee;
};
