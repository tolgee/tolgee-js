import { FormatIcu } from '@tolgee/format-icu';
import { useRouter } from 'next/router';
import {
  NsFallback,
  Tolgee,
  TolgeeProvider,
  getFallbackArray,
  DevTools,
  useTolgeeSSR,
} from '@tolgee/react';

const apiKey = process.env.NEXT_PUBLIC_TOLGEE_API_KEY;
const apiUrl = process.env.NEXT_PUBLIC_TOLGEE_API_URL;

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
          await import(`../public/i18n/${namespace}/${locale}.json`)
        ).default;
      } else {
        result[`${locale}`] = (
          await import(`../public/i18n/${locale}.json`)
        ).default;
      }
    }
  }

  return result;
};

type Props = {
  locales: any;
};

const tolgee = Tolgee()
  .use(FormatIcu())
  .use(DevTools())
  .init({
    availableLanguages: ['en', 'cs'],
    defaultLanguage: 'en',
    apiKey: apiKey,
    apiUrl: apiUrl,
  });

export const TolgeeNextProvider = ({
  locales,
  children,
}: React.PropsWithChildren<Props>) => {
  const router = useRouter();
  const tolgeeSSR = useTolgeeSSR(tolgee, router.locale, locales);

  return (
    <TolgeeProvider
      tolgee={tolgeeSSR}
      fallback="Loading..."
      options={{ useSuspense: true }}
    >
      {children}
    </TolgeeProvider>
  );
};
