import { useLocale } from 'next-intl';

import { Link } from '@/navigation';
import { Navbar } from '@/components/Navbar';
import { getStaticData } from '@/tolgee/shared';
import { TolgeeNextProvider } from '@/tolgee/client';

import { TranslationMethodsServer } from './TranslationMethodsServer';
import { TranslationMethodsClient } from './TranslationMethodsClient';

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
        <TranslationMethodsServer />
      </main>
    </TolgeeNextProvider>
  );
}
