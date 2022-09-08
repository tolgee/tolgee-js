/* eslint-disable @typescript-eslint/no-var-requires */
import { TolgeeReact, useTolgee } from '@tolgee/react';
import { IcuFormatter } from '@tolgee/icu-formatter';

import { Todos } from './Todos';
import { TranslationMethods } from './TranslationMethods';

TolgeeReact()
  .setFormatter(IcuFormatter())
  .init({
    language: 'en',
    staticData: {
      en: () => import('./i18n/en.json'),
      de: () => import('./i18n/de.json'),
      cs: () => import('./i18n/cs.json'),
      fr: () => import('./i18n/fr.json'),
    },
    apiUrl: process.env.REACT_APP_TOLGEE_API_URL,
    apiKey: process.env.REACT_APP_TOLGEE_API_KEY,
  })
  .run();

export const App = () => {
  const currentRoute = window.location.pathname;
  const { isInitialLoading } = useTolgee(['initialLoad']);

  return (
    <>
      {isInitialLoading() ? (
        <div>Loading ...</div>
      ) : currentRoute === '/translation-methods' ? (
        <TranslationMethods />
      ) : (
        <Todos />
      )}
    </>
  );
};
