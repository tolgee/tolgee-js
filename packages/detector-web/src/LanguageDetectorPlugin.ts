import type { TolgeePlugin } from '@tolgee/core';
import { LanguageDetector } from './LanguageDetector';

export const DetectorPlugin = (): TolgeePlugin => (tolgee, tools) => {
  tools.setLanguageDetector(LanguageDetector());
  return tolgee;
};
