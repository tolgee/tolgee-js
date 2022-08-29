import { ObserverOptions, ObserverPlugin, WrapperPlugin } from '../types';
import { GeneralObserver } from './GeneralObserver';
import { InvisibleWrapper } from './invisible/InvisibleWrapper';

export const InvisibleObserver =
  (options?: ObserverOptions): ObserverPlugin =>
  () => {
    const wrapper = InvisibleWrapper();
    return GeneralObserver(wrapper, options);
  };
