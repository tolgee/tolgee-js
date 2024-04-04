import { useEffect } from 'react';
import { useTolgee } from './basicTolgee';

export const App = () => {
  const tolgee = useTolgee(['update', 'language']);

  useEffect(() => {
    tolgee.run();
  }, []);

  return <div>{tolgee.t('on-the-road-title')}</div>;
};
