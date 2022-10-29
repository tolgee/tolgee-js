import type { TolgeePlugin } from '@tolgee/core';
import { ContextUi } from './ContextUi';
import { DevBackend } from './DevBackend';
import { TextObserver } from './TextObserver';
import { InvisibleObserver } from './InvisibleObserver';
import { InContextOptions } from './types';

/**
 * Plugin which is dynamically downloaded for in-context on production
 */
export const InContextProduction =
  (props?: InContextOptions): TolgeePlugin =>
  (tolgee, tools) => {
    const { credentials, type = 'invisible', ...observerOptions } = props || {};
    tolgee.use(DevBackend());
    if (!tools.hasUi()) {
      tolgee.use(ContextUi());
    }
    if (!tools.hasObserver()) {
      if (type === 'text') {
        tolgee.use(TextObserver(observerOptions));
      } else {
        tolgee.use(InvisibleObserver(observerOptions));
      }
    }
    if (credentials) {
      tolgee.overrideCredentials(credentials);
    }
    return tolgee;
  };
