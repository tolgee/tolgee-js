import { Suspense, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Namespaces from './components/Namespaces';
import { Navbar } from './components/Navbar';

export const TranslationMethods = () => {
  const { t } = useTranslation();
  const [revealed, setRevealed] = useState(false);

  return (
    <main className="translation-methods">
      <Navbar>
        <div slot="menu-items">
          <a href="/">The example app</a>
        </div>
      </Navbar>

      <div className="tiles">
        <div>
          <h1>t function without default</h1>
          <div>{t('this_is_a_key')}</div>
        </div>

        <div>
          <h1>t function with params</h1>
          <div>
            {t('this_is_a_key_with_params', { key: 'value', key2: 'value2' })}
          </div>
        </div>

        <div>
          <h1>t function with noWrap</h1>
          <div>{t('this_is_a_key', { noWrap: true })}</div>
        </div>

        <div>
          <h1>t function with default</h1>
          <div>{t('this_key_does_not_exist', 'This is default')}</div>
        </div>
      </div>
      {!revealed ? (
        <div className="load-more-section">
          <button className="button" onClick={() => setRevealed(true)}>
            Load more
          </button>
        </div>
      ) : (
        <Suspense fallback="Loading namespace...">
          <Namespaces />
        </Suspense>
      )}
    </main>
  );
};
