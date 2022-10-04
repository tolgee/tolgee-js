import type { TolgeePlugin, DevCredentials } from '@tolgee/core';

export declare const ContextUi: () => TolgeePlugin;
export declare const InContextTools: (
  overrideCredentials?: DevCredentials
) => TolgeePlugin;
export declare const DevTools: typeof InContextTools;

export * from '../lib/typedIndex';
