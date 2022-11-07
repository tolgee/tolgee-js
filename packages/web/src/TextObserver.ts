import type { ObserverInterface } from '@tolgee/core';
import { GeneralObserver } from './observers/general/GeneralObserver';
import { setNodeText } from './observers/general/helpers';
import { TextWrapper } from './observers/text/TextWrapper';

export const TextObserver =
  (): ObserverInterface =>
  ({ translate, onClick, options }) => {
    const wrapper = TextWrapper({
      inputPrefix: options.inputPrefix,
      inputSuffix: options.inputSuffix,
      translate,
    });
    const { wrap, unwrap, stop, forEachElement, highlight, run } =
      GeneralObserver(wrapper, options, onClick);

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
      run,
      retranslate,
      highlight,
      outputNotFormattable: true,
    };
  };
