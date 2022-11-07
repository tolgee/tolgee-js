import type { LanguageStorageInterface, TolgeePlugin } from '@tolgee/core';

const CURRENT_LANGUAGE_LOCAL_STORAGE_KEY = '__tolgee_currentLanguage';

export const LanguageStorageCreator = (): LanguageStorageInterface => {
  return {
    getLanguage() {
      const storedLanguage = localStorage.getItem(
        CURRENT_LANGUAGE_LOCAL_STORAGE_KEY
      );

      return storedLanguage || undefined;
    },
    setLanguage(language: string) {
      localStorage.setItem(CURRENT_LANGUAGE_LOCAL_STORAGE_KEY, language);
    },
  };
};

export const LanguageStorage = (): TolgeePlugin => (tolgee, tools) => {
  tools.setLanguageStorage(LanguageStorageCreator());
  return tolgee;
};
