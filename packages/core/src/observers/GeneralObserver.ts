import { INVISIBLE_CHARACTERS } from './invisible/secret';
import {
  xPathEvaluate,
  filterRestricted,
  getNodeText,
  lockNode,
  unlockNode,
  translateChildNode,
  getAndInitParent,
} from './helpers';
import { TOLGEE_ATTRIBUTE_NAME } from '../constants';
import { NodeLock, NodeMeta, WrapperPlugin } from '../types';

export const GeneralObserver = (wrapper: ReturnType<WrapperPlugin>) => {
  let observer: MutationObserver | undefined;
  let isObserving = false;

  function handleNodes(nodes: Array<Text | Attr>) {
    for (const textNode of nodes) {
      if ((textNode as any)[TOLGEE_ATTRIBUTE_NAME] === undefined) {
        (textNode as any)[TOLGEE_ATTRIBUTE_NAME] = {} as NodeLock;
      }
      const tolgeeData = (textNode as any)[TOLGEE_ATTRIBUTE_NAME] as
        | NodeMeta
        | undefined;
      if (tolgeeData?.locked !== true) {
        lockNode(textNode);
        const text = getNodeText(textNode);
        const result = text !== null ? wrapper.unwrap(text) : null;
        if (result) {
          const { text, keys } = result;
          const translatedNode = translateChildNode(textNode, text, keys);
          const parentElement = getAndInitParent(translatedNode);
          parentElement._tolgee.nodes.add(translatedNode);
          console.log(parentElement);
          // this.elementRegistrar.register(parentElement);
        }
        unlockNode(textNode);
      }
    }
  }

  const createObserver = (): MutationObserver => {
    return new MutationObserver((mutationsList: MutationRecord[]) => {
      if (!isObserving) {
        return;
      }
      for (const mutation of mutationsList) {
        switch (mutation.type) {
          case 'characterData': {
            const xPath = `./descendant-or-self::text()[contains(., '${INVISIBLE_CHARACTERS[0]}')]`;
            const nodes = xPathEvaluate(xPath, mutation.target);
            const filtered: Text[] = filterRestricted(nodes as Text[]);

            handleNodes(filtered);
            break;
          }
          case 'childList':
            console.log(mutation);
            break;
          case 'attributes':
            console.log(mutation);
            break;
        }
      }
    });
  };

  const stop = () => {
    isObserving = false;
    observer?.disconnect();
    observer = undefined;
  };

  const run = () => {
    isObserving = true;
    observer = createObserver();
    observer.observe(document.body, {
      attributes: true,
      childList: true,
      subtree: true,
      characterData: true,
    });
  };

  return Object.freeze({
    stop,
    run,
    wrap: wrapper.wrap,
    unwrap: wrapper.unwrap,
    isObserving: () => isObserving,
  });
};

export type GeneralObserverType = ReturnType<typeof GeneralObserver>;
