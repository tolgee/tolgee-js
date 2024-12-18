import React, { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { TolgeeNextProvider } from '@/tolgee/client';
import { ALL_LANGUAGES } from '@/tolgee/shared';
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
