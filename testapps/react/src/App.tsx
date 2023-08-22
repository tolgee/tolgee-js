/* eslint-disable @typescript-eslint/no-var-requires */
import { Tolgee, TolgeeProvider, BackendFetch, DevTools } from '@tolgee/react';

import { Todos } from './Todos';
import { TranslationMethods } from './TranslationMethods';
import { FormatIcu } from '@tolgee/format-icu';

const tolgee = Tolgee()
  .use(DevTools())
  .use(FormatIcu())
  .use(BackendFetch())
  .init({
    availableLanguages: ['en', 'cs', 'fr', 'de'],
    apiUrl: process.env.REACT_APP_TOLGEE_API_URL,
    apiKey: process.env.REACT_APP_TOLGEE_API_KEY,
    projectId: process.env.REACT_APP_TOLGEE_PROJECT_ID,
    fallbackLanguage: 'en',
    defaultLanguage: 'en',
  });

export const App = () => {
  const currentRoute = window.location.pathname;

  return (
    <TolgeeProvider tolgee={tolgee}>
      {currentRoute === '/translation-methods' ? (
        <TranslationMethods />
      ) : (
        <Todos />
      )}
    </TolgeeProvider>
  );
};
