import {
  Tolgee,
  DevTools,
  type NsFallback,
  getFallbackArray,
  BackendFetch,
} from '@tolgee/vue';
import { FormatIcu } from '@tolgee/format-icu';

export const createTolgee = () => {
  return Tolgee()
    .use(DevTools())
    .use(FormatIcu())
    .use(BackendFetch())
    .init({
      availableLanguages: ['en', 'de', 'fr', 'cs'],
      language: 'en',
      apiUrl: import.meta.env.VITE_APP_TOLGEE_API_URL,
      apiKey: import.meta.env.VITE_APP_TOLGEE_API_KEY,
    });
};

export const getServerLocales = async (
  locale: string | undefined,
  ns?: NsFallback
) => {
  const namespaces = ['', ...getFallbackArray(ns)];
  const result: Record<string, any> = {};

  if (locale) {
    for (const namespace of namespaces) {
      if (namespace) {
        result[`${locale}:${namespace}`] = (
          await import(`./public/i18n/${namespace}/${locale}.json`)
        ).default;
      } else {
        result[`${locale}`] = (
          await import(`./public/i18n/${locale}.json`)
        ).default;
      }
    }
  }

  return result;
};
