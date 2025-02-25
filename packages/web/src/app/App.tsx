import { useEffect } from 'react';
import { useTolgee } from './basicTolgee';

import { Todos } from './Todos';
import { TranslationMethods } from './TranslationMethods';

export const App = () => {
  const currentRoute = window.location.pathname;
  const tolgee = useTolgee(['initialLoad']);

  useEffect(() => {
    tolgee.run();
  }, []);

  if (!tolgee.isLoaded()) {
    return null;
  }

  return (
    <>
      {currentRoute === '/translation-methods' ? (
        <TranslationMethods />
      ) : (
        <Todos />
      )}
    </>
  );
};
