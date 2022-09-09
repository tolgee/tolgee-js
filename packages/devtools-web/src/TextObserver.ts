import type { ObserverPlugin } from '@tolgee/core';
import type { ObserverOptions } from './types';
import { GeneralObserver } from './observers/general/GeneralObserver';
import { setNodeText } from './observers/general/helpers';
import { initOptions } from './observers/general/initOptions';
import { TextWrapper } from './observers/text/TextWrapper';

export const TextObserver =
  (options?: ObserverOptions): ObserverPlugin =>
  ({ translate, onClick }) => {
    const observerOptions = initOptions(options);
    const wrapper = TextWrapper({
      inputPrefix: observerOptions.inputPrefix,
      inputSuffix: observerOptions.inputSuffix,
      translate,
    });
    const { wrap, unwrap, stop, forEachElement } = GeneralObserver(
      wrapper,
      observerOptions,
      onClick
    );

    const retranslate = () => {
      forEachElement((_, elMeta) => {
        for (const [node, nodeMeta] of elMeta.nodes.entries()) {
          if (nodeMeta.keyAttributeOnly) {
            return;
          }
          const result = wrapper.unwrap(nodeMeta.oldTextContent);
          if (result) {
            setNodeText(node, result.text);
          }
        }
      });
    };

    return {
      wrap,
      unwrap,
      stop,
      retranslate,
    };
  };
