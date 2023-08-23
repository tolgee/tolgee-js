import Link from 'next-intl/link';
import { useLocale } from 'next-intl';

import { Navbar } from 'components/Navbar';
import { TranslationMethodsServer } from './TranslationMethodsServer';
import { TranslationMethodsClient } from './TranslationMethodsClient';
import { getStaticData } from 'tolgee/shared';
import { TolgeeNextProvider } from 'tolgee/client';

export default async function AboutPage() {
  const locale = useLocale();
  const locales = await getStaticData(['en', locale]);

  return (
    <TolgeeNextProvider locale={locale} locales={locales}>
      <main className="translation-methods">
        <Navbar>
          <div slot="menu-items">
            <Link href="/">The example app</Link>
          </div>
        </Navbar>
        <TranslationMethodsClient />
        {/* @ts-ignore */}
        <TranslationMethodsServer />
      </main>
    </TolgeeNextProvider>
  );
}
