import type { TolgeePlugin } from '@tolgee/core';
import { InvisibleObserver } from './InvisibleObserver';
import { DevBackend } from './DevBackend';
import { ContextUi } from './ContextUi';
import { TextObserver } from './TextObserver';
import { InContextOptions } from './types';
import { BrowserExtensionPlugin } from './typedIndex';

export const InContextTools =
  (props?: InContextOptions): TolgeePlugin =>
  (tolgee, tools) => {
    const { credentials, type = 'invisible', ...observerOptions } = props || {};
    tolgee.use(BrowserExtensionPlugin(observerOptions));
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
