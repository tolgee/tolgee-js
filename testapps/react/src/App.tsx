/* eslint-disable @typescript-eslint/no-var-requires */
import { InvisibleObserver, Tolgee, TolgeeProvider, UI } from '@tolgee/react';
import { IcuFormatter } from '@tolgee/icu-formatter';

import { Todos } from './Todos';
import { TranslationMethods } from './TranslationMethods';

const tolgee = Tolgee()
  .setFormatter(IcuFormatter())
  .setObserver(InvisibleObserver())
  .setUi(UI as any)
  .init({
    staticData: {
      en: () => import('./i18n/en.json'),
      de: () => import('./i18n/de.json'),
      cs: () => import('./i18n/cs.json'),
      fr: () => import('./i18n/fr.json'),
    },
    apiUrl: process.env.REACT_APP_TOLGEE_API_URL,
    apiKey: process.env.REACT_APP_TOLGEE_API_KEY,
  });

export const App = () => {
  const currentRoute = window.location.pathname;

  return (
    <TolgeeProvider tolgee={tolgee} fallback={<div>Loading...</div>}>
      {currentRoute === '/translation-methods' ? (
        <TranslationMethods />
      ) : (
        <Todos />
      )}
    </TolgeeProvider>
  );
};
