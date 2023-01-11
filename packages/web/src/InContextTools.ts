import type { TolgeePlugin } from '@tolgee/core';
import { ContextUi } from './ContextUi';
import { DevBackend } from './DevBackend';
import { InContextOptions } from './types';
import { ObserverPlugin } from './ObserverPlugin';

export const InContextTools =
  (props?: InContextOptions): TolgeePlugin =>
  (tolgee, tools) => {
    const { credentials } = props || {};
    tolgee.addPlugin(DevBackend());
    if (!tools.hasUi()) {
      tolgee.addPlugin(ContextUi());
    }
    if (!tools.hasObserver()) {
      tolgee.addPlugin(ObserverPlugin());
    }
    if (credentials) {
      tolgee.overrideCredentials(credentials);
    }
    return tolgee;
  };
