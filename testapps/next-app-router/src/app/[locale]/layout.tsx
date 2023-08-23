import { notFound } from 'next/navigation';
import { useLocale } from 'next-intl';
import { ReactNode } from 'react';
import { TolgeeNextProvider } from 'tolgee/client';
import { getStaticData } from 'tolgee/shared';

type Props = {
  children: ReactNode;
  params: { locale: string };
};

export default async function LocaleLayout({ children, params }: Props) {
  const locale = useLocale();

  const locales = await getStaticData(['en', locale]);

  // Show a 404 error if the user requests an unknown locale
  if (params.locale !== locale) {
    notFound();
  }

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
