import { getTranslate } from 'tolgee/server';
import { Todos } from './Todos';
import Link from 'next-intl/link';

import { Navbar } from 'components/Navbar';

export default async function IndexPage() {
  const t = await getTranslate();
  return (
    <div className="background-wrapper">
      <div className="example">
        <Navbar>
          <Link href="/translation-methods">
            {t('menu-item-translation-methods')}
          </Link>
        </Navbar>
        <header>
          <h1 className="header__title">{t('on-the-road-title')}</h1>
          <h2 className="header__subtitle">{t('on-the-road-subtitle')}</h2>
        </header>
        <Todos />
      </div>
    </div>
  );
}
