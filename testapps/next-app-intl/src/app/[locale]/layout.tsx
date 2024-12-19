import { notFound } from 'next/navigation';
import { ReactNode } from 'react';
import { TolgeeNextProvider } from '@/tolgee/client';
import { ALL_LANGUAGES } from '@/tolgee/shared';
import React from 'react';
import { getTolgee } from '@/tolgee/server';

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!ALL_LANGUAGES.includes(locale)) {
    notFound();
  }

  // it's important you provide all data which are needed for initial render
  // so current locale and also fallback locales + necessary namespaces
  const tolgee = await getTolgee();
  const records = await tolgee.loadRequired();

  return (
    <html lang={locale}>
      <body>
        <TolgeeNextProvider language={locale} staticData={records}>
          {children}
        </TolgeeNextProvider>
      </body>
    </html>
  );
}
