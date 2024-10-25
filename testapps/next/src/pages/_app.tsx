import type { AppContext, AppInitialProps, AppProps } from 'next/app';
import { getStaticData, tolgee } from '../tolgee';
import App from 'next/app';
import { TolgeeProvider, TolgeeStaticData } from '@tolgee/react';
import { useRouter } from 'next/router';

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
  context: AppContext & { locale: string }
): Promise<AppOwnProps & AppInitialProps> => {
  const ctx = await App.getInitialProps(context);

  return { ...ctx, staticData: await getStaticData([context.router.locale!]) };
};
