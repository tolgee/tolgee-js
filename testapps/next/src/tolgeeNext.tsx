import { IcuPlugin } from '@tolgee/icu-formatter';
import {
  FallbackNSTranslation,
  ReactPlugin,
  Tolgee,
  getFallback,
  TolgeeProvider,
} from '@tolgee/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const apiKey = process.env.NEXT_PUBLIC_TOLGEE_API_KEY;
const apiUrl = process.env.NEXT_PUBLIC_TOLGEE_API_URL;

export const useTolgeeSSR = (staticLocales: any) => {
  const router = useRouter();
  const [tolgee] = useState(
    Tolgee()
      .use(ReactPlugin())
      .use(IcuPlugin())
      .init({
        language: router.locale,
        apiKey: apiKey,
        apiUrl: apiUrl,
        staticData: {
          en: () => import('./i18n/en.json'),
          cs: () => import('./i18n/cs.json'),
          de: () => import('./i18n/de.json'),
          fr: () => import('./i18n/fr.json'),
          'en:base': () => import('./i18n/en/base.json'),
          'en:test1': () => import('./i18n/en/test1.json'),
          'en:test2': () => import('./i18n/en/test2.json'),
          'en:test3': () => import('./i18n/en/test3.json'),
          'cs:base': () => import('./i18n/cs/base.json'),
          'cs:test1': () => import('./i18n/cs/test1.json'),
          'cs:test2': () => import('./i18n/cs/test2.json'),
          'cs:test3': () => import('./i18n/cs/test3.json'),
          'de:base': () => import('./i18n/de/base.json'),
          'de:test1': () => import('./i18n/de/test1.json'),
          'de:test2': () => import('./i18n/de/test2.json'),
          'de:test3': () => import('./i18n/de/test3.json'),
          'fr:base': () => import('./i18n/fr/base.json'),
          'fr:test1': () => import('./i18n/fr/test1.json'),
          'fr:test2': () => import('./i18n/fr/test2.json'),
          'fr:test3': () => import('./i18n/fr/test3.json'),
          ...staticLocales,
        },
      })
  );

  useEffect(() => {
    tolgee.changeLanguage(router.locale!);
  }, [router.locale]);

  return tolgee;
};

export const getServerLocales = async (
  locale: string | undefined,
  ns?: FallbackNSTranslation
) => {
  const namespaces = getFallback(ns) || [''];
  const result: Record<string, any> = {};

  if (locale) {
    for (const namespace of namespaces) {
      if (namespace) {
        result[`${locale}:${namespace}`] = (
          await import(`./i18n/${locale}/${namespace}.json`)
        ).default;
      } else {
        result[`${locale}`] = (await import(`./i18n/${locale}.json`)).default;
      }
    }
  }

  return result;
};

type Props = {
  locales: any;
};

export const TolgeeNextProvider: React.FC<Props> = ({ locales, children }) => {
  const tolgee = useTolgeeSSR(locales);
  return (
    <TolgeeProvider
      tolgee={tolgee}
      fallback="Loading..."
      options={{ useSuspense: false }}
    >
      {children}
    </TolgeeProvider>
  );
};
