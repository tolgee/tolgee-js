import { getContext } from 'svelte';
import { getGlobalContext } from './GlobalContextPlugin';
import type { TolgeeSvelteContext } from './types';

/**
 * Returns Tolgee context.
 * @throws Error when context is not defined.
 */
export const getTolgeeContext = (): TolgeeSvelteContext => {
  const context = (getContext('tolgeeContext') ||
    getGlobalContext()) as TolgeeSvelteContext;
  if (context === undefined) {
    throw Error(
      'Tolgee context is undefined. Trying to use getTranslate method or T component outside TolgeeProvider?'
    );
  }
  return context;
};
