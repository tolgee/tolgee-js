import {
  BackendFetch,
  DevTools,
  I18nextPlugin,
  Tolgee,
  withTolgee,
} from '@tolgee/i18next';
import i18next from 'i18next';
import ICU from 'i18next-icu';

export const tolgee = Tolgee()
  .use(DevTools())
  .use(BackendFetch())
  .use(I18nextPlugin())
  .init({
    apiUrl: process.env.VUE_APP_TOLGEE_API_URL,
    apiKey: process.env.VUE_APP_TOLGEE_API_KEY,
  });

withTolgee(i18next, tolgee)
  .use(ICU)
  .init({
    lng: 'en', // or use i18next language detector
    supportedLngs: ['cs', 'en', 'fr', 'de'],
  });

export { i18next };
