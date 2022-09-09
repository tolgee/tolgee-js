import type { TolgeePlugin } from '@tolgee/core';
import type { ObserverOptions } from './types';
import { InvisibleObserver } from 'InvisibleObserver';
import { UI } from './ui/index';

let DevToolsPlugin: (options?: Partial<ObserverOptions>) => TolgeePlugin = () =>
  undefined;

if (process.env.NODE_ENV !== 'production') {
  DevToolsPlugin = (options) => (tolgee) => {
    tolgee.setObserver(InvisibleObserver(options));
    tolgee.setUi(UI as any);
    return tolgee;
  };
}

export { DevToolsPlugin };
