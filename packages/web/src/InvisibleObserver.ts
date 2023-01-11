import type { ObserverMiddleware } from '@tolgee/core';
import { GeneralObserver } from './observers/general/GeneralObserver';
import { InvisibleWrapper } from './observers/invisible/InvisibleWrapper';

export const InvisibleObserver =
  (): ObserverMiddleware =>
  ({ onClick, options }) => {
    const wrapper = InvisibleWrapper();
    const observer = GeneralObserver(wrapper, options, onClick);
    return { ...observer, retranslate: () => {}, outputNotFormattable: false };
  };
