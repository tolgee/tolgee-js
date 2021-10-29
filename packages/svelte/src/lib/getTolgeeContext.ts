import type { Tolgee } from '@tolgee/core';
import { getContext } from 'svelte';

export type TolgeeContext = {
  tolgee: Tolgee;
};

/**
 * Returns Tolgee context.
 * @throws Error when context is not defined.
 */
const getTolgeeContext = (): TolgeeContext => {
  const context = getContext('tolgeeContext') as TolgeeContext;
  if (context === undefined) {
    throw Error(
      'Tolgee context is undefined. Trying to use getTranslate method or T component outside TolgeeProvider?'
    );
  }
  return context;
};

export default getTolgeeContext;
