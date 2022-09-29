import type { ObserverInterface, TolgeePlugin } from '@tolgee/core';
import type { ObserverOptions } from './types';
import { GeneralObserver } from './observers/general/GeneralObserver';
import { initOptions } from './observers/general/initOptions';
import { InvisibleWrapper } from './observers/invisible/InvisibleWrapper';

const InvisibleObserverCreator =
  (options?: Partial<ObserverOptions>): ObserverInterface =>
  ({ onClick }) => {
    const observerOptions = initOptions(options);
    const wrapper = InvisibleWrapper();
    const observer = GeneralObserver(wrapper, observerOptions, onClick);
    return { ...observer, retranslate: () => {}, outputNotFormattable: false };
  };

export const InvisibleObserver =
  (options?: Partial<ObserverOptions>): TolgeePlugin =>
  (tolgee, tools) => {
    tools.setObserver(InvisibleObserverCreator(options));
    return tolgee;
  };
