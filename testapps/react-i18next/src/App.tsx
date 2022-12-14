/* eslint-disable @typescript-eslint/no-var-requires */
import { Suspense } from 'react';
import { Tolgee, withTolgee, I18nextPlugin, DevTools } from '@tolgee/i18next';
import i18n from 'i18next';
import ICU from 'i18next-icu';
import { initReactI18next } from 'react-i18next';

import { Todos } from './Todos';
import { TranslationMethods } from './TranslationMethods';

const tolgee = Tolgee()
  .use(DevTools())
  .use(I18nextPlugin())
  .init({
    staticData: {
      en: () => import('./i18n/en.json'),
      de: () => import('./i18n/de.json'),
      fr: () => import('./i18n/fr.json'),
      cs: () => import('./i18n/cs.json'),
    },
    apiUrl: process.env.REACT_APP_TOLGEE_API_URL,
    apiKey: process.env.REACT_APP_TOLGEE_API_KEY,
  });

withTolgee(i18n, tolgee)
  .use(ICU)
  .use(initReactI18next)
  .init({
    lng: 'en',
    supportedLngs: ['cs', 'en', 'fr', 'de'],
  });

export const App = () => {
  const currentRoute = window.location.pathname;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      {currentRoute === '/translation-methods' ? (
        <TranslationMethods />
      ) : (
        <Todos />
      )}
    </Suspense>
  );
};
