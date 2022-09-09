import {
  TOLGEE_WRAPPED_ONLY_DATA_ATTRIBUTE,
  TranslationOnClick,
  WrapperInterface,
} from '@tolgee/core';
import { ObserverOptions } from '../../types';

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
  let isObserving = true;

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
      const parentElement = domHelper.getSuitableParent(node);
      elementRegistry.register(parentElement, node, {
        oldTextContent: '',
        keys: [{ key: getNodeText(node) }],
        keyAttributeOnly: true,
      });
    });
  };

  const observer = new MutationObserver((mutationsList: MutationRecord[]) => {
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

  observer.observe(document.body, {
    attributes: true,
    childList: true,
    subtree: true,
    characterData: true,
  });

  const stop = () => {
    isObserving = false;
    observer?.disconnect();
    elementRegistry.stop();
  };

  return Object.freeze({
    stop,
    wrap: wrapper.wrap,
    unwrap: wrapper.unwrap,
    forEachElement: elementRegistry.forEachElement,
  });
};

export type GeneralObserverType = ReturnType<typeof GeneralObserver>;
