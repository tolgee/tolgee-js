import { TOLGEE_ATTRIBUTE_NAME } from '@tolgee/core';
import type {
  ElementMeta,
  KeyWithDefault,
  NodeMeta,
  ObserverOptions,
  TolgeeElement,
  TranslationOnClick,
} from '@tolgee/core';
import { ElementHighlighter } from './ElementHighlighter';
import { initElementMeta } from './ElementMeta';
import { ElementStore } from './ElementStore';
import { nodeContains } from './helpers';
import { MouseEventHandler } from './MouseEventHandler';

export const ElementRegistry = (
  options: ObserverOptions,
  onClick: TranslationOnClick
) => {
  const elementStore = ElementStore();
  const elementHighlighter = ElementHighlighter({
    highlightColor: options.highlightColor,
    highlightWidth: options.highlightWidth,
  });
  const eventHandler = MouseEventHandler({
    highlightKeys: options.highlightKeys,
    elementStore,
    onClick: (event, el) => {
      const meta = elementStore.get(el)!;
      onClick(event, {
        el,
        meta,
        keysAndDefaults: getKeysAndDefaults(meta),
      });
    },
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

  function getTargetElement() {
    return options.targetElement || document.body;
  }

  function* getActiveNodes(meta: ElementMeta) {
    for (const [node, nodeMeta] of meta.nodes.entries()) {
      if (nodeContains(getTargetElement(), node)) {
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
    return getTargetElement().contains(element);
  }

  function getKeyOptions(meta: ElementMeta): KeyWithDefault[] {
    const nodes = Array.from(meta.nodes.values());
    return nodes.reduce(
      (acc, curr) => [
        ...acc,
        ...curr.keys.map((k) => ({
          key: k.key,
          defaultValue: k.defaultValue,
        })),
      ],
      [] as KeyWithDefault[]
    );
  }

  function getKeysAndDefaults(meta: ElementMeta): KeyWithDefault[] {
    if (meta.wrappedWithElementOnlyKey) {
      return [
        {
          key: meta.wrappedWithElementOnlyKey,
          defaultValue: meta.wrappedWithElementOnlyDefaultHtml,
        },
      ];
    }
    return getKeyOptions(meta);
  }

  return Object.freeze({
    register,
    forEachElement: elementStore.forEachElement,
    refreshAll,
    stop,
  });
};
