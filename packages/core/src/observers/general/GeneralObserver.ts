import { ObserverOptions, WrapperInterface } from '../../types';
import { DomHelper } from './DomHelper';
import { initNodeMeta } from './ElementMeta';
import { ElementRegistry } from './ElementRegistry';
import { getNodeText, setNodeText } from './helpers';
import { NodeHandler } from './NodeHandler';

export const GeneralObserver = (
  wrapper: WrapperInterface,
  options: ObserverOptions
) => {
  let isObserving = true;

  const domHelper = DomHelper(options);
  const nodeHandler = NodeHandler(options, wrapper);
  const elementRegistrar = ElementRegistry(options);

  function handleNodes(nodes: Array<Text | Attr>) {
    for (const textNode of nodes) {
      const oldTextContent = getNodeText(textNode);
      const result = oldTextContent ? wrapper.unwrap(oldTextContent) : null;
      if (result) {
        const { text, keys } = result;
        setNodeText(textNode, text);
        const nodeMeta = initNodeMeta(oldTextContent!, keys);
        const parentElement = domHelper.getSuitableParent(textNode);
        elementRegistrar.register(parentElement, textNode, nodeMeta);
      }
    }
  }

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
          result = nodeHandler.handleChildList(mutation.target);
          break;

        case 'attributes':
          result = nodeHandler.handleAttributes(mutation.target);
          break;
      }
      handleNodes(result);
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
  };

  return Object.freeze({
    stop,
    wrap: wrapper.wrap,
    unwrap: wrapper.unwrap,
    isObserving: () => isObserving,
  });
};

export type GeneralObserverType = ReturnType<typeof GeneralObserver>;
