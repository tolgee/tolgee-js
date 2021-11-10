/* eslint-disable @typescript-eslint/no-var-requires */
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { TolgeeProvider } from '@tolgee/react';

import enLocale from '../i18n/en.json';
import deLocale from '../i18n/de.json';
import frLocale from '../i18n/fr.json';
import csLocale from '../i18n/cs.json';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  const apiKey = process.env.NEXT_PUBLIC_TOLGEE_API_KEY;

  return (
    <TolgeeProvider
      ui={apiKey ? require('@tolgee/ui').UI : undefined}
      forceLanguage={router.locale}
      apiKey={apiKey}
      apiUrl={process.env.NEXT_PUBLIC_TOLGEE_API_URL}
      staticData={{
        en: enLocale,
        de: deLocale,
        fr: frLocale,
        cs: csLocale,
      }}
      loadingFallback={<div>Loading...</div>}
    >
      <Component {...pageProps} />
    </TolgeeProvider>
  );
}

export default MyApp;
