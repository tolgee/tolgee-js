import type { DevCredentials, TolgeePlugin } from '@tolgee/core';
import { InvisibleObserver } from './InvisibleObserver';
import { DevBackend } from './DevBackend';
import { ContextUi } from './ContextUi';
import { TextObserver } from './TextObserver';

export const InContextTools =
  (overrideCredentials?: DevCredentials): TolgeePlugin =>
  (tolgee, tools) => {
    tolgee.use(DevBackend());
    if (!tools.hasUi()) {
      tolgee.use(ContextUi());
    }
    if (overrideCredentials) {
      tolgee.overrideCredentials(overrideCredentials);
    }
    tools.onPrepare(() => {
      if (!tools.hasObserver()) {
        if (tolgee.getInitialOptions().observerType === 'text') {
          tolgee.use(TextObserver());
        } else {
          tolgee.use(InvisibleObserver());
        }
      }
    });
    return tolgee;
  };
