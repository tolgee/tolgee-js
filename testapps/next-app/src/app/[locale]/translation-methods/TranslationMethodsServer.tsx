import { T, getTranslate } from '@/tolgee/server';

export const TranslationMethodsServer = async () => {
  const t = await getTranslate();

  return (
    <>
      <h1 className="section-title">Server</h1>
      <div className="tiles">
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
            <span>
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
            </span>
          </div>
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
          <h1>Translation in translation</h1>
          <div>
            <div data-cy="translationOuter">
              <T
                keyName="translation_outer"
                params={{
                  b: (
                    <b data-cy="translationInner">
                      {t('translation_inner', 'Translation')}
                    </b>
                  ),
                }}
              >
                {'<b>Translation</b> in translation'}
              </T>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
