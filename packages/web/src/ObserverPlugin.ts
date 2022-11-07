import { TolgeePlugin } from '@tolgee/core';
import { InvisibleObserver } from './InvisibleObserver';
import { TextObserver } from './TextObserver';

export const ObserverPlugin = (): TolgeePlugin => (tolgee, tools) => {
  if (tolgee.getInitialOptions().observerType === 'text') {
    tools.setObserver(TextObserver());
  } else {
    tools.setObserver(InvisibleObserver());
  }
  return tolgee;
};
