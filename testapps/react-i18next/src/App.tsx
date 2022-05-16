/* eslint-disable @typescript-eslint/no-var-requires */
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { Todos } from './Todos';
import { TranslationMethods } from './TranslationMethods';

export const App = () => {
  const currentRoute = window.location.pathname;
  const { t } = useTranslation();

  useEffect(() => {
    document.title = t('title', { framework: 'i18next' });
  }, [t]);

  return currentRoute === '/translation-methods' ? (
    <TranslationMethods />
  ) : (
    <Todos />
  );
};
