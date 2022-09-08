import { useContext } from 'react';
import { getGlobalInstance } from '@tolgee/core';
import { TolgeeProviderContext } from './TolgeeProvider';

export const useTolgeeContext = () => {
  const context = useContext(TolgeeProviderContext);
  const tolgee = context?.tolgee || getGlobalInstance();
  if (!tolgee) {
    throw new Error(
      "Couldn't find tolgee instance, did you forgot to use `ReactPlugin`?"
    );
  }
  return tolgee;
};
