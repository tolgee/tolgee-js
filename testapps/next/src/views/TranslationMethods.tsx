import { Suspense, useState } from 'react';
import { T, useTranslate } from '@tolgee/react';
import Link from 'next/link';
import { Navbar } from '../components/Navbar';
import Namespaces from '../components/Namespaces';

export const TranslationMethods = () => {
  const { t } = useTranslate();
  const [revealed, setRevealed] = useState(false);

  return (
    <main className="translation-methods">
      <Navbar>
        <Link href="/">
          <a>The example app</a>
        </Link>
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
              params={{ key: 'value', key2: 'value2' }}
            />
          </div>
        </div>

        <div>
          <h1>T component with noWrap</h1>
          <div>
            <T
              keyName="this_is_a_key_with_params"
              params={{ key: 'value', key2: 'value2' }}
              noWrap
            />
          </div>
        </div>

        <div>
          <h1>T component with interpolation</h1>
          <div data-cy="translationWithTags">
            <T
              keyName="this_is_a_key_with_tags"
              params={{
                b: <b />,
                i: <i />,
                key: 'value',
              }}
            >
              Hey
            </T>
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
          <div>{t('this_is_a_key', { noWrap: true })}</div>
        </div>

        <div>
          <h1>t function with default</h1>
          <div>{t('this_key_does_not_exist', 'This is default')}</div>
        </div>

        <div>
          <h1>t function with props object</h1>
          <div>
            {t({
              key: 'this_is_a_key',
              params: { key: 'value', key2: 'value2' },
            })}
          </div>
        </div>

        <div>
          <h1>t function with props object noWrap is true</h1>
          <div>
            {t({
              key: 'this_is_a_key',
              params: { key: 'value', key2: 'value2' },
              noWrap: true,
            })}
          </div>
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
