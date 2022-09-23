import type { TolgeePlugin } from '@tolgee/core';
import { LanguageStorage } from './LanguageStorage';

export const StoragePlugin = (): TolgeePlugin => (tolgee, tools) => {
  tools.setLanguageStorage(LanguageStorage());
  return tolgee;
};
