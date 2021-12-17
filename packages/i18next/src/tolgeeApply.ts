import { Tolgee } from '@tolgee/core';
import { i18n } from 'i18next';

export const tolgeeApply = (tolgee: Tolgee, i18n: i18n) => {
  const updateTranslations = () => {
    tolgee.translationService
      .getCachedTranslations()
      .forEach((translations, lang) => {
        i18n.removeResourceBundle(lang, 'translation');
        i18n.addResources(lang, 'translation', translations);
      });
  };

  tolgee.onTranslationChange.subscribe(updateTranslations);
  i18n.on('languageChanged', (lang) => {
    if (lang && tolgee.lang !== lang) {
      tolgee.lang = lang;
    }
  });

  i18n.tolgee = tolgee;
};

declare module 'i18next' {
  interface i18n {
    tolgee: Tolgee;
  }
}
