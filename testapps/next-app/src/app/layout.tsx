import { ReactNode } from 'react';
import { TolgeeNextProvider } from '@/tolgee/client';
import { getStaticData } from '@/tolgee/shared';
import { getLanguage } from '@/tolgee/language';
import './style.css';

type Props = {
  children: ReactNode;
  params: { locale: string };
};

export default async function LocaleLayout({ children }: Props) {
  const locale = await getLanguage();
  // it's important you provide all data which are needed for initial render
  // so current language and also fallback languages + necessary namespaces
  const staticData = await getStaticData([locale, 'en']);

  return (
    <html lang={locale}>
      <body>
        <TolgeeNextProvider language={locale} staticData={staticData}>
          {children}
        </TolgeeNextProvider>
      </body>
    </html>
  );
}
