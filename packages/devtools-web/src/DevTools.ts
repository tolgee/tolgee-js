import type { TolgeePlugin } from '@tolgee/core';
import type { ObserverOptions } from './types';
import { InvisibleObserver } from './InvisibleObserver';
import { DevBackend } from './DevBackend';
import { ContextUi } from './ContextUi';

let DevTools: (options?: Partial<ObserverOptions>) => TolgeePlugin =
  () => (tolgee) =>
    tolgee;

if (process.env.NODE_ENV !== 'production') {
  DevTools = (options) => (tolgee, tools) => {
    tolgee.use(InvisibleObserver(options));
    tolgee.use(DevBackend());
    tolgee.use(ContextUi());
    return tolgee;
  };
}

export { DevTools };
