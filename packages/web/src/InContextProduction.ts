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
    const {
      credentials,
      observerType = 'invisible',
      ...observerOptions
    } = props || {};
    tolgee.addPlugin(DevBackend());
    if (!tools.hasUi()) {
      tolgee.addPlugin(ContextUi());
    }
    if (!tools.hasObserver()) {
      if (observerType === 'text') {
        tolgee.addPlugin(TextObserver(observerOptions));
      } else {
        tolgee.addPlugin(InvisibleObserver(observerOptions));
      }
    }
    if (credentials) {
      tolgee.overrideCredentials(credentials);
    }
    return tolgee;
  };
