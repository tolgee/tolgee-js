/* eslint-disable @typescript-eslint/no-var-requires */
import { ReactPlugin, Tolgee, TolgeeProvider } from '@tolgee/react';
import { IcuPlugin } from '@tolgee/icu-formatter';

import { Todos } from './Todos';
import { TranslationMethods } from './TranslationMethods';

const tolgee = Tolgee()
  .use(ReactPlugin())
  .use(IcuPlugin())
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
    fallbackLanguage: 'en',
  });

export const App = () => {
  const currentRoute = window.location.pathname;

  return (
    <TolgeeProvider tolgee={tolgee} fallback="Loading...">
      {currentRoute === '/translation-methods' ? (
        <TranslationMethods />
      ) : (
        <Todos />
      )}
    </TolgeeProvider>
  );
};
