import type { TolgeePlugin } from '@tolgee/core';
import { ObserverOptions } from '../lib/types';

export declare const UiPlugin: () => TolgeePlugin;
export declare const DevTools: (
  options?: Partial<ObserverOptions>
) => TolgeePlugin;

export * from '../lib/typedIndex';
