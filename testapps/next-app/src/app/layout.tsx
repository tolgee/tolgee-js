import { ReactNode } from 'react';
import { TolgeeNextProvider } from '@/tolgee/client';
import { getTolgee } from '@/tolgee/server';
import { getLanguage } from '@/tolgee/language';
import './style.css';

type Props = {
  children: ReactNode;
};

export default async function LocaleLayout({ children }: Props) {
  const locale = await getLanguage();
  const tolgee = await getTolgee();
  const staticData = await tolgee.load(locale);

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
