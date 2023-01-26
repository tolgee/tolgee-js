import { TolgeeInstance } from '@tolgee/web';
import { i18n } from 'i18next';

export const tolgeeApply = (tolgee: TolgeeInstance, i18n: i18n) => {
  const updateTranslations = () => {
    tolgee.getAllRecords().forEach(({ language, namespace, data }) => {
      if (i18n.getResourceBundle(language, namespace)) {
        i18n.removeResourceBundle(language, namespace);
        i18n.addResources(language, namespace, Object.fromEntries(data));
      }
    });
  };

  tolgee.on('update', updateTranslations);
  i18n.on('languageChanged', (lang) => {
    if (lang && tolgee.getLanguage() !== lang) {
      tolgee.changeLanguage(lang);
    }
  });

  i18n.tolgee = tolgee;
};

declare module 'i18next' {
  interface i18n {
    tolgee: TolgeeInstance;
  }
}
