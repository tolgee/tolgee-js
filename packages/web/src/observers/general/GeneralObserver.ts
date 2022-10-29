import {
  FallbackNsTranslation,
  TranslationOnClick,
  WrapperInterface,
  ObserverRunProps,
} from '@tolgee/core';

import { ObserverOptions } from './initObserverOptions';
import { TOLGEE_WRAPPED_ONLY_DATA_ATTRIBUTE } from '../../constants';
import { DomHelper } from './DomHelper';
import { initNodeMeta } from './ElementMeta';
import { ElementRegistry } from './ElementRegistry';
import { getNodeText, setNodeText, xPathEvaluate } from './helpers';
import { NodeHandler } from './NodeHandler';

export const GeneralObserver = (
  wrapper: WrapperInterface,
  options: ObserverOptions,
  onClick: TranslationOnClick
) => {
  let isObserving = false;

  const domHelper = DomHelper(options);
  const nodeHandler = NodeHandler(options, wrapper);
  const elementRegistry = ElementRegistry(options, onClick);

  function handleNodes(nodes: Array<Text | Attr>) {
    for (const textNode of nodes) {
      const oldTextContent = getNodeText(textNode);
      const result = oldTextContent ? wrapper.unwrap(oldTextContent) : null;
      if (result) {
        const { text, keys } = result;
        setNodeText(textNode, text);
        const nodeMeta = initNodeMeta(oldTextContent!, keys);
        const parentElement = domHelper.getSuitableParent(textNode);
        elementRegistry.register(parentElement, textNode, nodeMeta);
      }
    }
  }

  const handleKeyAttribute = (node: Node) => {
    const xPath = `./descendant-or-self::*[@${TOLGEE_WRAPPED_ONLY_DATA_ATTRIBUTE}]`;
    const elements = xPathEvaluate(xPath, node) as Element[];
    elements.forEach((element) => {
      const node = element.getAttributeNode(TOLGEE_WRAPPED_ONLY_DATA_ATTRIBUTE);
      const parentElement = domHelper.getSuitableParent(node as Node);
      elementRegistry.register(parentElement, node as Node, {
        oldTextContent: '',
        keys: [{ key: getNodeText(node as Node)! }],
        keyAttributeOnly: true,
      });
    });
  };

  const createMutationObserver = () => {
    return new MutationObserver((mutationsList: MutationRecord[]) => {
      if (!isObserving) {
        return;
      }
      for (const mutation of mutationsList) {
        let result: (Attr | Text)[] = [];
        switch (mutation.type) {
          case 'characterData':
            result = nodeHandler.handleText(mutation.target);
            break;

          case 'childList':
            handleKeyAttribute(mutation.target);
            result = nodeHandler.handleChildList(mutation.target);
            break;

          case 'attributes':
            handleKeyAttribute(mutation.target);
            result = nodeHandler.handleAttributes(mutation.target);
            break;
        }
        handleNodes(result);
        elementRegistry.refreshAll();
      }
    });
  };

  let observer: MutationObserver;

  const run = ({ mouseHighlight }: ObserverRunProps) => {
    if (!observer) {
      observer = createMutationObserver();
    }
    const targetElement = options.targetElement || document.body;
    isObserving = true;
    elementRegistry.run(mouseHighlight);

    // initially go through all elements
    handleKeyAttribute(targetElement);
    handleNodes(nodeHandler.handleChildList(targetElement));

    // then observe for changes
    observer.observe(options.targetElement || document.body, {
      attributes: true,
      childList: true,
      subtree: true,
      characterData: true,
    });
  };

  const stop = () => {
    isObserving = false;
    elementRegistry.stop();
    observer.disconnect();
  };

  const highlight = (key?: string, ns?: FallbackNsTranslation) => {
    const elements = elementRegistry.findAll(key, ns);
    elements.forEach((el) => el.highlight?.());

    return {
      unhighlight() {
        elements.forEach((el) => el.unhighlight?.());
      },
    };
  };

  return Object.freeze({
    run,
    stop,
    wrap: wrapper.wrap,
    unwrap: wrapper.unwrap,
    forEachElement: elementRegistry.forEachElement,
    highlight,
  });
};

export type GeneralObserverType = ReturnType<typeof GeneralObserver>;
