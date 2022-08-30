import { TOLGEE_ATTRIBUTE_NAME } from '../../constants';
import { NodeMeta, ObserverOptions, TolgeeElement } from '../../types';
import { ElementHighlighter } from './ElementHighlighter';
import { initElementMeta } from './ElementMeta';
import { ElementStore } from './ElementStore';
import { MouseEventHandler } from './MouseEventHandler';

export const ElementRegistry = (options: ObserverOptions) => {
  const elementStore = ElementStore();
  const elementHighlighter = ElementHighlighter({
    highlightColor: options.highlightColor,
    highlightWidth: options.highlightWidth,
  });
  const eventHandler = MouseEventHandler({
    highlightKeys: options.highlightKeys,
    elementStore,
    onClick: console.log,
  });

  function register(element: Element, node: Node, nodeMeta: NodeMeta) {
    const tolgeeElement = element as TolgeeElement;
    let elementMeta = elementStore.get(tolgeeElement);
    if (!elementMeta) {
      elementMeta = initElementMeta();
      tolgeeElement.setAttribute(TOLGEE_ATTRIBUTE_NAME, 'true');
      elementStore.set(tolgeeElement, elementMeta);
    }
    elementMeta.nodes.set(node, nodeMeta);
    elementHighlighter.initHighlighter(tolgeeElement, elementMeta);
  }

  // function refreshAll() {
  //   for (const element of registredElements) {
  //     if (!element._tolgee.preventClean) {
  //       cleanElementInactiveNodes(element);
  //       if (
  //         element._tolgee.nodes.size === 0 &&
  //         !element._tolgee.wrappedWithElementOnlyKey
  //       ) {
  //         cleanElement(element);
  //       }
  //     }
  //   }
  // }

  // function cleanAll() {
  //   for (const registeredElement of registredElements) {
  //     cleanElement(registeredElement);
  //   }
  // }

  // function findAllByKey(key: string) {
  //   const result: ElementWithMeta[] = [];
  //   for (const registeredElement of registredElements) {
  //     if (registeredElement._tolgee.wrappedWithElementOnlyKey === key) {
  //       result.push(registeredElement);
  //       continue;
  //     }
  //     for (const node of registeredElement._tolgee.nodes) {
  //       if (
  //         node._tolgee.keys.findIndex(
  //           (keyWithParams) => keyWithParams.key === key
  //         ) > -1
  //       ) {
  //         result.push(registeredElement);
  //         break;
  //       }
  //     }
  //   }
  //   return result;
  // }

  // function cleanElementInactiveNodes(element: ElementWithMeta) {
  //   if (isElementActive(element)) {
  //     element._tolgee.nodes = new Set(getActiveNodes(element));
  //     return;
  //   }
  // }

  // function cleanElement(element: ElementWithMeta) {
  //   if (!element._tolgee.preventClean) {
  //     if (element._tolgee.highlightEl) {
  //       element._tolgee.unhighlight?.();
  //     }
  //     element.removeAttribute(TOLGEE_ATTRIBUTE_NAME);
  //     // @ts-ignore
  //     delete element._tolgee;
  //     registredElements.delete(element);
  //   }
  // }

  // function isElementActive(element: ElementWithMeta) {
  //   return options.targetElement.contains(element);
  // }

  return Object.freeze({
    register,
  });
};
