import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Navbar } from './components/Navbar';
import { Test } from './Test';

export const TranslationMethods = () => {
  const { t } = useTranslation('methods');
  const [displayStuff, setDisplayStuff] = useState(false);

  return (
    <main className="translation-methods">
      <Navbar>
        <div slot="menu-items">
          <a href="/">The example app</a>
        </div>
      </Navbar>

      <div className="tiles">
        <div>
          <h1>T component with default</h1>
          <div>{t('this_key_does_not_exist', 'This is default')}</div>
        </div>
        <div>
          <h1>T component without default</h1>
          <div>{t('this_is_a_key')}</div>
        </div>
        <div>
          <h1>T component with params</h1>
          <div>
            {t('this_is_a_key_with_params', { key: 'value', key2: 'value2' })}
          </div>
        </div>
        <div>
          <h1>test</h1>
          <div>
            {displayStuff ? (
              <Test />
            ) : (
              <button onClick={() => setDisplayStuff(true)}>test</button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};
