import { withTolgee } from '@tolgee/i18next';
import i18n from 'i18next';
import ICU from 'i18next-icu';
import { initReactI18next } from 'react-i18next';

withTolgee(i18n, {
  staticData: {
    en: () => import('./i18n/en.json'),
    de: () => import('./i18n/de.json'),
    fr: () => import('./i18n/fr.json'),
    cs: () => import('./i18n/cs.json'),
  },
  apiUrl: process.env.REACT_APP_TOLGEE_API_URL,
  apiKey: process.env.REACT_APP_TOLGEE_API_KEY,
})
  .use(ICU)
  .use(initReactI18next)
  .init({
    lng: 'en',
    defaultNS: 'global',
    ns: ['global'],
    fallbackLng: 'en',
    supportedLngs: ['cs', 'en', 'fr', 'de'],
  });

export default i18n;
