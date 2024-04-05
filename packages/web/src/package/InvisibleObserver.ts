import type { ObserverMiddleware, ObserverRunProps } from '@tolgee/core';
import { GeneralObserver } from './observers/general/GeneralObserver';
import { InvisibleWrapper } from './observers/invisible/InvisibleWrapper';

export const InvisibleObserver = (): ObserverMiddleware => () => {
  const observer = GeneralObserver();

  const self = Object.freeze({
    ...observer,
    run(props: ObserverRunProps) {
      const wrapper = InvisibleWrapper({
        fullKeyEncode: props.options.fullKeyEncode,
      });
      observer.run({ ...props, wrapper });
    },
    retranslate() {},
    outputNotFormattable: false,
  });
  return self;
};
