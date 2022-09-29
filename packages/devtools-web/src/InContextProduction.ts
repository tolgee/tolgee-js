import { TolgeePlugin } from '@tolgee/core';
import { ContextUi } from 'ContextUi';
import { InvisibleObserver } from 'InvisibleObserver';

export const InContextProduction = (): TolgeePlugin => (tolgee, tools) => {
  if (!tools.getObserver()) {
    tolgee.use(InvisibleObserver());
  }
  if (!tools.getUi()) {
    tolgee.use(ContextUi());
  }
  return tolgee;
};
