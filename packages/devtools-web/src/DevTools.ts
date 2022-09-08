import type { ObserverOptions, TolgeePlugin } from '@tolgee/core';
import { InvisibleObserver } from 'InvisibleObserver';
import { UI } from './ui/index';

let DevTools: (
  options?: Partial<ObserverOptions>
) => TolgeePlugin | undefined = () => undefined;

if (process.env.NODE_ENV !== 'production') {
  DevTools = (options) => (tolgee) => {
    tolgee.setObserver(InvisibleObserver(options));
    tolgee.setUi(UI as any);
  };
}

export { DevTools };
