import type { ObserverOptions, ObserverPlugin } from '@tolgee/core';
import { GeneralObserver } from './observers/general/GeneralObserver';
import { initOptions } from './observers/general/initOptions';
import { InvisibleWrapper } from './observers/invisible/InvisibleWrapper';

export const InvisibleObserver =
  (options?: Partial<ObserverOptions>): ObserverPlugin =>
  ({ onClick }) => {
    const observerOptions = initOptions(options);
    const wrapper = InvisibleWrapper();
    const observer = GeneralObserver(wrapper, observerOptions, onClick);
    return { ...observer, retranslate: () => {} };
  };
