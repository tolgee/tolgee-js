import { ObserverOptions, ObserverPlugin } from '../types';
import { GeneralObserver } from './general/GeneralObserver';
import { initOptions } from './general/initOptions';
import { InvisibleWrapper } from './invisible/InvisibleWrapper';

export const InvisibleObserver =
  (options?: ObserverOptions): ObserverPlugin =>
  ({ onClick }) => {
    const observerOptions = initOptions(options);
    const wrapper = InvisibleWrapper();
    const observer = GeneralObserver(wrapper, observerOptions, onClick);
    return { ...observer, retranslate: () => {} };
  };
