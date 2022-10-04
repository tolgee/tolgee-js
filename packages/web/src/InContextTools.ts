import type { DevCredentials, TolgeePlugin } from '@tolgee/core';
import { InvisibleObserver } from './InvisibleObserver';
import { DevBackend } from './DevBackend';
import { ContextUi } from './ContextUi';

export const InContextTools =
  (overrideCredentials?: DevCredentials): TolgeePlugin =>
  (tolgee, tools) => {
    tolgee.use(DevBackend());
    if (!tools.hasObserver()) {
      tolgee.use(InvisibleObserver());
    }
    if (!tools.hasUi()) {
      tolgee.use(ContextUi());
    }
    if (overrideCredentials) {
      tools.overrideCredentials(overrideCredentials);
    }
    return tolgee;
  };
