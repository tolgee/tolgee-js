import { TOLGEE_ATTRIBUTE_NAME } from '../../constants';
import {
  ElementMeta,
  NodeMeta,
  ObserverOptions,
  TolgeeElement,
} from '../../types';
import { ElementHighlighter } from './ElementHighlighter';
import { initElementMeta } from './ElementMeta';
import { ElementStore } from './ElementStore';
import { nodeContains } from './helpers';
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

  function stop() {
    eventHandler.stop();
  }

  function refreshAll() {
    elementStore.forEachElement((element, meta) => {
      if (!meta.preventClean) {
        cleanElementInactiveNodes(element, meta);
        if (meta.nodes.size === 0 && !meta.wrappedWithElementOnlyKey) {
          cleanElement(element, meta);
        }
      }
    });
  }

  function findAllByKey(key: string) {
    const result: TolgeeElement[] = [];
    elementStore.forEachElement((element, meta) => {
      if (meta.wrappedWithElementOnlyKey === key) {
        result.push(element);
        return;
      }
      for (const nodeMeta of meta.nodes.values()) {
        if (
          nodeMeta.keys.findIndex(
            (keyWithParams) => keyWithParams.key === key
          ) > -1
        ) {
          result.push(element);
          break;
        }
      }
    });
    return result;
  }

  function cleanElementInactiveNodes(
    element: TolgeeElement,
    meta: ElementMeta
  ) {
    if (isElementActive(element)) {
      meta.nodes = new Map(getActiveNodes(meta));
      return;
    }
  }

  function* getActiveNodes(meta: ElementMeta) {
    for (const [node, nodeMeta] of meta.nodes.entries()) {
      if (nodeContains(options.targetElement, node)) {
        yield [node, nodeMeta] as const;
      }
    }
  }

  function cleanElement(element: TolgeeElement, meta: ElementMeta) {
    if (!meta.preventClean) {
      if (meta.highlightEl) {
        meta.unhighlight?.();
      }
      element.removeAttribute(TOLGEE_ATTRIBUTE_NAME);
      elementStore.remove(element);
    }
  }

  function isElementActive(element: TolgeeElement) {
    return options.targetElement.contains(element);
  }

  return Object.freeze({
    register,
    forEachElement: elementStore.forEachElement,
    refreshAll,
    stop,
  });
};
