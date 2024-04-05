import { TolgeeInstance } from '@tolgee/core';

export const DevTools = () => (tolgee: TolgeeInstance) => tolgee;
export * from './typedIndex';
export {
  PREFERRED_LANGUAGES_LOCAL_STORAGE_KEY,
  DEVTOOLS_ID,
} from './constants';
