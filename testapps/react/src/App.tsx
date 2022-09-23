/* eslint-disable @typescript-eslint/no-var-requires */
import { ReactPlugin, Tolgee, TolgeeProvider } from '@tolgee/react';
import { IcuPlugin } from '@tolgee/icu-formatter';
import { DetectorPlugin } from '@tolgee/detector-web';
import { StoragePlugin } from '@tolgee/storage-web';

import { Todos } from './Todos';
import { TranslationMethods } from './TranslationMethods';
import { Namespaces } from './Namespaces';

const tolgee = Tolgee()
  .use(ReactPlugin())
  .use(IcuPlugin())
  .use(DetectorPlugin())
  .use(StoragePlugin())
  .init({
    staticData: {
      en: () => import('./i18n/en.json'),
      de: () => import('./i18n/de.json'),
      cs: () => import('./i18n/cs.json'),
      fr: () => import('./i18n/fr.json'),
      'en:base': () => import('./i18n/en/base.json'),
      'en:test1': () => import('./i18n/en/test1.json'),
      'en:test2': () => import('./i18n/en/test2.json'),
      'en:test3': () => import('./i18n/en/test3.json'),
      'cs:base': () => import('./i18n/cs/base.json'),
      'cs:test1': () => import('./i18n/cs/test1.json'),
      'cs:test2': () => import('./i18n/cs/test2.json'),
      'cs:test3': () => import('./i18n/cs/test3.json'),
    },
    apiUrl: process.env.REACT_APP_TOLGEE_API_URL,
    apiKey: process.env.REACT_APP_TOLGEE_API_KEY,
    fallbackLanguage: 'en',
    defaultLanguage: 'en',
  });

export const App = () => {
  const currentRoute = window.location.pathname;

  return (
    <TolgeeProvider tolgee={tolgee} fallback="Loading...">
      {currentRoute === '/translation-methods' ? (
        <TranslationMethods />
      ) : currentRoute === '/namespaces' ? (
        <Namespaces />
      ) : (
        <Todos />
      )}
    </TolgeeProvider>
  );
};
