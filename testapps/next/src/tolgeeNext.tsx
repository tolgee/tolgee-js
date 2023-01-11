import { useMemo } from 'react';
import { FormatIcu } from '@tolgee/format-icu';
import { useRouter } from 'next/router';
import {
  NsFallback,
  DevTools,
  Tolgee,
  getFallback,
  TolgeeProvider,
} from '@tolgee/react';

const apiKey = process.env.NEXT_PUBLIC_TOLGEE_API_KEY;
const apiUrl = process.env.NEXT_PUBLIC_TOLGEE_API_URL;

const tolgee = Tolgee()
  .use(DevTools())
  .use(FormatIcu())
  .init({
    availableLanguages: ['en', 'cs'],
    defaultLanguage: 'en',
    apiKey: apiKey,
    apiUrl: apiUrl,
  });

export const useTolgeeSSR = (staticLocales: any) => {
  const router = useRouter();

  useMemo(() => {
    // we have to prepare tolgee before rendering children
    // so translations are available right away
    // events emitting must be off, to not trigger re-render while rendering
    tolgee.setEmmiterActive(false);
    tolgee.addStaticData(staticLocales);
    tolgee.changeLanguage(router.locale!);
    tolgee.setEmmiterActive(true);
  }, [router.locale, staticLocales]);

  return tolgee;
};

export const getServerLocales = async (
  locale: string | undefined,
  ns?: NsFallback
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
