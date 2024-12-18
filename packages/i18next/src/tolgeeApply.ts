import { TolgeeInstance } from '@tolgee/web';
import { i18n } from 'i18next';

export const tolgeeApply = (tolgee: TolgeeInstance, i18n: i18n) => {
  const updateTranslations = () => {
    tolgee.getAllRecords().forEach(({ language, namespace, data }) => {
      if (i18n.getResourceBundle(language, namespace)) {
        i18n.addResourceBundle(
          language,
          namespace,
          data instanceof Map ? Object.fromEntries(data) : data,
          false,
          true
        );
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
