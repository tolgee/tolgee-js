import { TOLGEE_ATTRIBUTE_NAME } from '../constants';
import { ElementWithMeta, ObserverOptions } from '../types';
import { ElementHighlighter } from './ElementHighlighter';
import { nodeContains } from './helpers';
import { MouseEventHandler } from './MouseEventHandler';

export const ElementRegistrar = (options: ObserverOptions) => {
  const registeredElements: Set<ElementWithMeta> = new Set();
  const elementHighlighter = ElementHighlighter({
    highlightColor: options.highlightColor,
    highlightWidth: options.highlightWidth,
  });

  const eventHandler = MouseEventHandler({
    highlightKeys: options.highlightKeys,
  });

  function register(element: ElementWithMeta) {
    // ignore element with no active nodes
    if (
      getActiveNodes(element).next().value === undefined &&
      !element._tolgee.wrappedWithElementOnlyKey
    ) {
      return;
    }
    if (!registeredElements.has(element)) {
      registeredElements.add(element);
      elementHighlighter.initHighlighter(element);
    }
    console.log(registeredElements);
  }

  function refreshAll() {
    for (const element of registeredElements) {
      if (!element._tolgee.preventClean) {
        cleanElementInactiveNodes(element);
        if (
          element._tolgee.nodes.size === 0 &&
          !element._tolgee.wrappedWithElementOnlyKey
        ) {
          cleanElement(element);
        }
      }
    }
  }

  function cleanAll() {
    for (const registeredElement of registeredElements) {
      cleanElement(registeredElement);
    }
  }

  function findAllByKey(key: string) {
    const result: ElementWithMeta[] = [];
    for (const registeredElement of registeredElements) {
      if (registeredElement._tolgee.wrappedWithElementOnlyKey === key) {
        result.push(registeredElement);
        continue;
      }
      for (const node of registeredElement._tolgee.nodes) {
        if (
          node._tolgee.keys.findIndex(
            (keyWithParams) => keyWithParams.key === key
          ) > -1
        ) {
          result.push(registeredElement);
          break;
        }
      }
    }
    return result;
  }

  function cleanElementInactiveNodes(element: ElementWithMeta) {
    if (isElementActive(element)) {
      element._tolgee.nodes = new Set(getActiveNodes(element));
      return;
    }
  }

  function cleanElement(element: ElementWithMeta) {
    if (!element._tolgee.preventClean) {
      if (element._tolgee.highlightEl) {
        element._tolgee.unhighlight?.();
      }
      element.removeAttribute(TOLGEE_ATTRIBUTE_NAME);
      // @ts-ignore
      delete element._tolgee;
      registeredElements.delete(element);
    }
  }

  function* getActiveNodes(element: ElementWithMeta) {
    for (const node of element._tolgee.nodes) {
      if (nodeContains(options.targetElement, node)) {
        yield node;
      }
    }
  }

  function isElementActive(element: ElementWithMeta) {
    return options.targetElement.contains(element);
  }

  return Object.freeze({
    register,
  });
};
