/* eslint-disable @typescript-eslint/no-var-requires */
export * from './entry-production';
import { TolgeeInstance } from '@tolgee/core';

export const DevTools =
  process.env.NODE_ENV === 'production'
    ? () => (tolgee: TolgeeInstance) => tolgee
    : require('../dist/tolgee-in-context-tools.umd').InContextTools;
