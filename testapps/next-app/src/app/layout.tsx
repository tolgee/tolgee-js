import { ReactNode } from 'react';
import { TolgeeNextProvider } from '@/tolgee/client';
import { getStaticData } from '@/tolgee/shared';
import { getLocale } from '@/tolgee/language';
import './style.css';

type Props = {
  children: ReactNode;
  params: { locale: string };
};

export default async function LocaleLayout({ children }: Props) {
  const locale = await getLocale();
  // it's important you provide all data which are needed for initial render
  // so current locale and also fallback locales + necessary namespaces
  const locales = await getStaticData([locale, 'en']);

  return (
    <html lang={locale}>
      <body>
        <TolgeeNextProvider locale={locale} locales={locales}>
          {children}
        </TolgeeNextProvider>
      </body>
    </html>
  );
}
