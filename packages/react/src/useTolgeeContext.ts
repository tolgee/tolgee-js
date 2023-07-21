import { useContext } from 'react';
import { getGlobalContext } from './GlobalContextPlugin';
import { getProviderInstance } from './TolgeeProvider';

export const useTolgeeContext = () => {
  const TolgeeProviderContext = getProviderInstance();
  const context = useContext(TolgeeProviderContext) || getGlobalContext();
  if (!context) {
    throw new Error(
      "Couldn't find tolgee instance, did you forgot to use `TolgeeProvider`?"
    );
  }
  return context;
};
