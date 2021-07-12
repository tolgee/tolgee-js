import { useContext } from 'react';
import { TolgeeProviderContext } from './TolgeeProvider';

export const useTolgeeContext = () => {
  const context = useContext(TolgeeProviderContext);

  if (context === null) {
    throw new Error(
      'Tolgee context is null. Is this code executed inside TolgeeProvider component?'
    );
  }

  return context;
};
