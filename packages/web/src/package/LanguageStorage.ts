import type { LanguageStorageMiddleware, TolgeePlugin } from '@tolgee/core';
import { throwIfSSR } from './tools/isSSR';

const CURRENT_LANGUAGE_LOCAL_STORAGE_KEY = '__tolgee_currentLanguage';

export function createLanguageStorage(): LanguageStorageMiddleware {
  return {
    getLanguage() {
      throwIfSSR('LanguageStorage');
      const storedLanguage = localStorage.getItem(
        CURRENT_LANGUAGE_LOCAL_STORAGE_KEY
      );

      return storedLanguage || undefined;
    },

    setLanguage(language: string) {
      throwIfSSR('LanguageStorage');
      localStorage.setItem(CURRENT_LANGUAGE_LOCAL_STORAGE_KEY, language);
    },
  };
}

export const LanguageStorage = (): TolgeePlugin => (tolgee, tools) => {
  tools.setLanguageStorage(createLanguageStorage());
  return tolgee;
};
