import type { TolgeePlugin } from '@tolgee/core';
import type { ObserverOptions } from './types';
import { InContextTools } from './InContextTools';

let DevTools: typeof InContextTools = () => (tolgee) => tolgee;

if (process.env.NODE_ENV !== 'production') {
  DevTools = InContextTools;
}

export { DevTools };
