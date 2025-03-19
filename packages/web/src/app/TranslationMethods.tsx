import { Navbar } from './components/Navbar';
import { useTolgee } from './basicTolgee';

export const TranslationMethods = () => {
  const { t } = useTolgee(['update']);

  return (
    <main className="translation-methods">
      <Navbar>
        <div slot="menu-items">
          <a href="/">The example app</a>
        </div>
      </Navbar>

      <div className="tiles">
        <div>
          <h1>App title</h1>
          <div>{t('app-title')}</div>
        </div>

        <div>
          <h1>Plural as default</h1>
          <div>
            {t(
              'non-existant',
              '{plural_value, plural, one {# item} other {# items}}',
              { plural_value: 2 }
            )}
          </div>
        </div>

        <div>
          <h1>Default value</h1>
          <div>{t('default-value', 'This is default')}</div>
        </div>
      </div>
    </main>
  );
};
