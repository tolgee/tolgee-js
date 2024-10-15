import { Link } from '@/navigation';
import { Navbar } from '@/components/Navbar';

import { TranslationMethodsServer } from './TranslationMethodsServer';
import { TranslationMethodsClient } from './TranslationMethodsClient';

export default async function AboutPage() {
  return (
    <main className="translation-methods">
      <Navbar>
        <div slot="menu-items">
          <Link href="/">The example app</Link>
        </div>
      </Navbar>
      <TranslationMethodsClient />
      <TranslationMethodsServer />
    </main>
  );
}
