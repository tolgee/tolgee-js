import type { TolgeePlugin, DevCredentials } from '@tolgee/core';
import type { InContextOptions } from '../lib/types';

export declare const ContextUi: () => TolgeePlugin;
export declare const InContextTools: (
  options?: InContextOptions
) => TolgeePlugin;
export declare const DevTools: typeof InContextTools;

export * from '../lib/typedIndex';
