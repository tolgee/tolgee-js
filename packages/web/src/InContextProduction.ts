import { TolgeePlugin } from '@tolgee/core';
import { ContextUi } from './ContextUi';
import { DevBackend } from './DevBackend';
import { InvisibleObserver } from './InvisibleObserver';

export const InContextProduction = (): TolgeePlugin => (tolgee, tools) => {
  tolgee.use(DevBackend());
  if (!tools.hasObserver()) {
    tolgee.use(InvisibleObserver());
  }
  if (!tools.hasUi()) {
    tolgee.use(ContextUi());
  }
  return tolgee;
};
