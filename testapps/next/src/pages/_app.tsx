import type { AppContext, AppInitialProps, AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { TolgeeProvider, TolgeeStaticDataProp } from '@tolgee/react';

import { tolgee } from '../tolgee';
import App from 'next/app';

type AppOwnProps = { staticData: TolgeeStaticDataProp };

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
    staticData: await tolgee.loadRequired({
      language: context.ctx.locale!,
    }),
  };
};
