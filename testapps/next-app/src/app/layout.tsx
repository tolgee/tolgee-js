import { ReactNode } from 'react';
import { TolgeeNextProvider } from '@/tolgee/client';
import { getTolgee } from '@/tolgee/server';
import { getLanguage } from '@/tolgee/language';
import './style.css';

type Props = {
  children: ReactNode;
};

export default async function LocaleLayout({ children }: Props) {
  const language = await getLanguage();
  const tolgee = await getTolgee();
  const staticData = await tolgee.loadRequired();

  return (
    <html lang={language}>
      <body>
        <TolgeeNextProvider language={language} staticData={staticData}>
          {children}
        </TolgeeNextProvider>
      </body>
    </html>
  );
}
