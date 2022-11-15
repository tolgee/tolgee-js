import { TolgeeInstance } from '@tolgee/web';
import { i18n } from 'i18next';

export const tolgeeApply = (tolgee: TolgeeInstance, i18n: i18n) => {
  const updateTranslations = () => {
    tolgee.getAllRecords().forEach(({ language, namespace, data }) => {
      const ns = namespace || 'translation';
      i18n.removeResourceBundle(language, ns);
      i18n.addResources(language, ns, Object.fromEntries(data));
    });
  };

  tolgee.on('initialLoad', updateTranslations);
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
