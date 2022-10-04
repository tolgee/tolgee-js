import type { ObserverInterface, TolgeePlugin } from '@tolgee/core';
import { GeneralObserver } from './observers/general/GeneralObserver';
import { InvisibleWrapper } from './observers/invisible/InvisibleWrapper';

const InvisibleObserverCreator =
  (): ObserverInterface =>
  ({ onClick, options }) => {
    const wrapper = InvisibleWrapper();
    const observer = GeneralObserver(wrapper, options, onClick);
    return { ...observer, retranslate: () => {}, outputNotFormattable: false };
  };

export const InvisibleObserver = (): TolgeePlugin => (tolgee, tools) => {
  tools.setObserver(InvisibleObserverCreator());
  return tolgee;
};
