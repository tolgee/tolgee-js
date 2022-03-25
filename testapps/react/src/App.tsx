/* eslint-disable @typescript-eslint/no-var-requires */
import { TolgeeProvider } from '@tolgee/react';
import { Todos } from './Todos';
import { TranslationMethods } from './TranslationMethods';

export const App = () => {
  const currentRoute = window.location.pathname;

  return (
    <TolgeeProvider
      staticData={{
        en: () => import('./i18n/en.json'),
        de: () => import('./i18n/de.json'),
        cs: () => import('./i18n/cs.json'),
        fr: () => import('./i18n/fr.json'),
      }}
      apiUrl={process.env.REACT_APP_TOLGEE_API_URL}
      apiKey={process.env.REACT_APP_TOLGEE_API_KEY}
      loadingFallback={<div>Loading...</div>}
      // remove this to enable language auto detection
      enableLanguageDetection={false}
    >
      {currentRoute === '/translation-methods' ? (
        <TranslationMethods />
      ) : (
        <Todos />
      )}
    </TolgeeProvider>
  );
};
