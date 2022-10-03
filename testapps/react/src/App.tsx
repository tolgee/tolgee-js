/* eslint-disable @typescript-eslint/no-var-requires */
import {
  Tolgee,
  TolgeeProvider,
  BackendFetch,
  ReactPlugin,
} from '@tolgee/react';
import { FormatIcu } from '@tolgee/format-icu';

import { Todos } from './Todos';
import { TranslationMethods } from './TranslationMethods';
import { Namespaces } from './Namespaces';

const tolgee = Tolgee()
  .use(ReactPlugin())
  .use(FormatIcu())
  .use(BackendFetch())
  .init({
    availableLanguages: ['en', 'cs', 'fr', 'de'],
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
