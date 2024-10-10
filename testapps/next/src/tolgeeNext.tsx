import { FormatIcu } from '@tolgee/format-icu';
import { useRouter } from 'next/router';
import { Tolgee, TolgeeProvider, DevTools, useTolgeeSSR } from '@tolgee/react';

const apiKey = process.env.NEXT_PUBLIC_TOLGEE_API_KEY;
const apiUrl = process.env.NEXT_PUBLIC_TOLGEE_API_URL;

type Props = {
  locales: any;
};

export const tolgee = Tolgee()
  .use(FormatIcu())
  .use(DevTools())
  .init({
    availableLanguages: ['en', 'cs'],
    defaultLanguage: 'en',
    apiKey: apiKey,
    apiUrl: apiUrl,
    staticData: {
      en: () => import('../public/i18n/en.json'),
      cs: () => import('../public/i18n/cs.json'),
      de: () => import('../public/i18n/de.json'),
      fr: () => import('../public/i18n/fr.json'),
      'en:namespaced': () => import('../public/i18n/namespaced/en.json'),
      'cs:namespaced': () => import('../public/i18n/namespaced/cs.json'),
      'de:namespaced': () => import('../public/i18n/namespaced/de.json'),
      'fr:namespaced': () => import('../public/i18n/namespaced/fr.json'),
    },
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
