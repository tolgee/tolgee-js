import { ObserverOptions, ObserverPlugin } from '../types';
import { GeneralObserver } from './general/GeneralObserver';
import { initOptions } from './general/initOptions';
import { NodeHandler } from './text/NodeHandler';
import { TextWrapper } from './text/TextWrapper';

export const TextObserver =
  (options?: ObserverOptions): ObserverPlugin =>
  ({ translate }) => {
    const observerOptions = initOptions(options);
    const wrapper = TextWrapper({
      inputPrefix: observerOptions.inputPrefix,
      inputSuffix: observerOptions.inputSuffix,
      translate,
    });
    return GeneralObserver(wrapper, NodeHandler, observerOptions);
  };
