import type { ObserverMiddleware, ObserverRunProps } from '@tolgee/core';
import { GeneralObserver } from './observers/general/GeneralObserver';
import { setNodeText } from './observers/general/helpers';
import { TextWrapper } from './observers/text/TextWrapper';

export const TextObserver = (): ObserverMiddleware => () => {
  const observer = GeneralObserver();

  const self = Object.freeze({
    ...observer,

    run(props: ObserverRunProps) {
      const wrapper = TextWrapper({
        inputPrefix: props.options.inputPrefix,
        inputSuffix: props.options.inputSuffix,
        translate: props.translate,
      });
      observer.run({ ...props, wrapper });
    },

    retranslate() {
      observer.forEachElement((_, elMeta) => {
        for (const [node, nodeMeta] of elMeta.nodes.entries()) {
          if (nodeMeta.keyAttributeOnly) {
            return;
          }
          const result = observer.unwrap(nodeMeta.oldTextContent);
          if (result) {
            setNodeText(node, result.text);
          }
        }
      });
    },

    outputNotFormattable: true,
  });
  return self;
};
