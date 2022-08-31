import { ObserverOptions, ObserverPlugin } from '../types';
import { GeneralObserver } from './general/GeneralObserver';
import { setNodeText } from './general/helpers';
import { initOptions } from './general/initOptions';
import { TextWrapper } from './text/TextWrapper';

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
