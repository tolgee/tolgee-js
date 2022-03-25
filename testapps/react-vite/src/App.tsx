/* eslint-disable @typescript-eslint/no-var-requires */
import { TolgeeProvider } from '@tolgee/react';
import { Todos } from './Todos';
import { TranslationMethods } from './TranslationMethods';
import './assets/style.css';

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
      apiUrl={import.meta.env.VITE_TOLGEE_API_URL as string}
      apiKey={import.meta.env.VITE_TOLGEE_API_KEY as string}
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
