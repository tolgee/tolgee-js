import { Navbar } from '@/components/Navbar';

import { TranslationMethodsServer } from './TranslationMethodsServer';
import { TranslationMethodsClient } from './TranslationMethodsClient';
import Link from 'next/link';

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
