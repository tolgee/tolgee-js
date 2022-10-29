import type { ObserverInterface, TolgeePlugin } from '@tolgee/core';
import {
  initObserverOptions,
  ObserverOptions,
} from './observers/general/initObserverOptions';
import { GeneralObserver } from './observers/general/GeneralObserver';
import { setNodeText } from './observers/general/helpers';
import { TextWrapper } from './observers/text/TextWrapper';

const TextObserverCreator =
  (inputOptions?: Partial<ObserverOptions>): ObserverInterface =>
  ({ translate, onClick }) => {
    const options = initObserverOptions(inputOptions);
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

export const TextObserver =
  (options?: Partial<ObserverOptions>): TolgeePlugin =>
  (tolgee, tools) => {
    tools.setObserver(TextObserverCreator(options));
    return tolgee;
  };
