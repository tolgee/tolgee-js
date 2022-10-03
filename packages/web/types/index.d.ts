import type { Options, TolgeePlugin } from '@tolgee/core';
import { ObserverOptions } from '../lib/types';

export declare const ContextUi: () => TolgeePlugin;
export declare const InContextProduction: () => TolgeePlugin;
export declare const InContextTools: (options?: {
  observer?: Partial<ObserverOptions>;
  tolgee?: Partial<Options>;
}) => TolgeePlugin;
export declare const DevTools: typeof InContextTools;

export * from '../lib/typedIndex';
