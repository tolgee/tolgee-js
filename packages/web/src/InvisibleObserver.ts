import type { ObserverInterface, TolgeePlugin } from '@tolgee/core';
import {
  initObserverOptions,
  ObserverOptions,
} from './observers/general/initObserverOptions';
import { GeneralObserver } from './observers/general/GeneralObserver';
import { InvisibleWrapper } from './observers/invisible/InvisibleWrapper';

const InvisibleObserverCreator =
  (inputOptions?: Partial<ObserverOptions>): ObserverInterface =>
  ({ onClick }) => {
    const options = initObserverOptions(inputOptions);
    const wrapper = InvisibleWrapper();
    const observer = GeneralObserver(wrapper, options, onClick);
    return { ...observer, retranslate: () => {}, outputNotFormattable: false };
  };

export const InvisibleObserver =
  (options?: Partial<ObserverOptions>): TolgeePlugin =>
  (tolgee, tools) => {
    tools.setObserver(InvisibleObserverCreator(options));
    return tolgee;
  };
