import React from 'react';
import { T, useTranslate } from '@tolgee/react';
import { Link } from 'gatsby-plugin-react-intl';

import { Navbar } from '../components/Navbar';

export const TranslationMethods = () => {
  const t = useTranslate();

  return (
    <main className="translation-methods">
      <Navbar>
        <div slot="menu-items">
          <Link to="/">The example app</Link>
        </div>
      </Navbar>

      <div className="tiles">
        <div>
          <h1>T component with default</h1>
          <div>
            <T keyName="this_key_does_not_exist">This is default</T>
          </div>
        </div>
        <div>
          <h1>T component without default</h1>
          <div>
            <T keyName="this_is_a_key" />
          </div>
        </div>
        <div>
          <h1>T component with params</h1>
          <div>
            <T
              keyName="this_is_a_key_with_params"
              parameters={{ key: 'value', key2: 'value2' }}
            />
          </div>
        </div>

        <div>
          <h1>T component with NO_WRAP strategy</h1>
          <div>
            <T
              keyName="this_is_a_key_with_params"
              parameters={{ key: 'value', key2: 'value2' }}
              strategy="NO_WRAP"
            />
          </div>
        </div>

        <div>
          <h1>T component with TEXT_WRAP strategy</h1>
          <div>
            <T
              keyName="this_is_a_key_with_params"
              parameters={{ key: 'value', key2: 'value2' }}
              strategy="TEXT_WRAP"
            />
          </div>
        </div>

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
          <div>{t('this_is_a_key', undefined, true)}</div>
        </div>

        <div>
          <h1>t function with default</h1>
          <div>
            {t('this_key_does_not_exist', undefined, false, 'This is default')}
          </div>
        </div>

        <div>
          <h1>t function with props object</h1>
          <div>
            {t({
              key: 'this_is_a_key',
              parameters: { key: 'value', key2: 'value2' },
            })}
          </div>
        </div>

        <div>
          <h1>t function with props object noWrap is true</h1>
          <div>
            {t({
              key: 'this_is_a_key',
              parameters: { key: 'value', key2: 'value2' },
              noWrap: true,
            })}
          </div>
        </div>
      </div>
    </main>
  );
};
