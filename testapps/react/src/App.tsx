/* eslint-disable @typescript-eslint/no-var-requires */
import { ReactPlugin, Tolgee, TolgeeProvider } from '@tolgee/react';
import { FormatIcu } from '@tolgee/format-icu';
import { DetectorPlugin } from '@tolgee/detector-web';
import { StoragePlugin } from '@tolgee/storage-web';
import { BackendPlugin } from '@tolgee/backend-fetch';

import { Todos } from './Todos';
import { TranslationMethods } from './TranslationMethods';
import { Namespaces } from './Namespaces';

const tolgee = Tolgee()
  .use(ReactPlugin())
  .use(FormatIcu())
  .use(DetectorPlugin())
  .use(StoragePlugin())
  .use(BackendPlugin({ prefix: '/youda' }))
  .init({
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
