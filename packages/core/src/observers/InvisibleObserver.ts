import { ObserverOptions, ObserverPlugin, WrapperPlugin } from '../types';
import { GeneralObserver } from './general/GeneralObserver';
import { initOptions } from './general/initOptions';
import { InvisibleWrapper } from './invisible/InvisibleWrapper';
import { NodeHandler } from './invisible/NodeHandler';

export const InvisibleObserver =
  (options?: ObserverOptions): ObserverPlugin =>
  () => {
    const observerOptions = initOptions(options);
    const wrapper = InvisibleWrapper();
    return GeneralObserver(wrapper, NodeHandler, observerOptions);
  };
