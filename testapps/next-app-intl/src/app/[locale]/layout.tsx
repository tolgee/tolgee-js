import { notFound } from 'next/navigation';
import { ReactNode } from 'react';
import { TolgeeNextProvider } from '@/tolgee/client';
import { ALL_LANGUAGES, getStaticData } from '@/tolgee/shared';

type Props = {
  children: ReactNode;
  params: { locale: string };
};

export default async function LocaleLayout({
  children,
  params: { locale },
}: Props) {
  if (!ALL_LANGUAGES.includes(locale)) {
    notFound();
  }

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
