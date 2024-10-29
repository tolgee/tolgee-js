import type { AppContext, AppInitialProps, AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { TolgeeProvider, TolgeeStaticData } from '@tolgee/react';

import { getStaticData, tolgee } from '../tolgee';
import App from 'next/app';

type AppOwnProps = { staticData: TolgeeStaticData };

export default function MyApp({
  Component,
  pageProps,
  staticData,
}: AppProps & AppOwnProps) {
  const router = useRouter();
  return (
    <TolgeeProvider
      tolgee={tolgee}
      ssr={{ language: router.locale, staticData }}
    >
      <Component {...pageProps} />
    </TolgeeProvider>
  );
}

MyApp.getInitialProps = async (
  context: AppContext
): Promise<AppOwnProps & AppInitialProps> => {
  const ctx = await App.getInitialProps(context);
  return {
    ...ctx,
    staticData: await getStaticData([context.ctx.locale!], ['', 'namespaced']),
  };
};
