import { FormatIcu } from '@tolgee/format-icu';
import {
  NsFallback,
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
    Tolgee().use(ReactPlugin()).use(FormatIcu()).init({
      apiKey: apiKey,
      apiUrl: apiUrl,
      language: router.locale,
      staticData: staticLocales,
    })
  );

  useEffect(() => {
    // add data to cache
    tolgee.addStaticData(staticLocales);
    // change language (order is important)
    tolgee.changeLanguage(router.locale!);
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
