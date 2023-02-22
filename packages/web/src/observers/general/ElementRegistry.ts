import { NsFallback, getFallback, ObserverOptionsInternal } from '@tolgee/core';
import { KeyAndParams, TranslationOnClick } from '@tolgee/core';
import {
  TOLGEE_RESTRICT_ATTRIBUTE,
  TOLGEE_ATTRIBUTE_NAME,
} from '../../constants';
import { ElementMeta, NodeMeta, TolgeeElement } from '../../types';

import { ElementHighlighter } from './ElementHighlighter';
import { initElementMeta } from './ElementMeta';
import { ElementStoreType } from './ElementStore';
import { compareDescriptors, nodeContains } from './helpers';
import { MouseEventHandler } from './MouseEventHandler';

export const ElementRegistry = (
  options: ObserverOptionsInternal,
  elementStore: ElementStoreType,
  onClick: TranslationOnClick
) => {
  const elementHighlighter = ElementHighlighter({
    highlightColor: options.highlightColor,
    highlightWidth: options.highlightWidth,
  });
  const eventHandler = MouseEventHandler({
    highlightKeys: options.highlightKeys,
    elementStore,
    onClick: (event, el) => {
      const meta = elementStore.get(el)!;
      onClick({
        event,
        keysAndDefaults: getKeysAndDefaults(meta),
      });
    },
    options,
  });

  function register(element: Element, node: Node, nodeMeta: NodeMeta) {
    if (isRestricted(element)) {
      return;
    }
    const tolgeeElement = element as TolgeeElement;
    let elementMeta = elementStore.get(tolgeeElement);
    if (!elementMeta) {
      elementMeta = initElementMeta();
      elementStore.set(tolgeeElement, elementMeta);
      tolgeeElement.setAttribute(TOLGEE_ATTRIBUTE_NAME, 'true');
    }
    elementMeta.nodes.set(node, nodeMeta);
    elementHighlighter.initHighlighter(tolgeeElement, elementMeta);
  }

  function run(mouseHighlight: boolean) {
    if (mouseHighlight) {
      eventHandler.run();
    }
  }

  function stop() {
    eventHandler.stop();
    elementStore.forEachElement((_, meta) => {
      if (meta.highlightEl) {
        meta.unhighlight?.();
      }
    });
  }

  function isRestricted(element: Element) {
    const restrictedElements = options.restrictedElements;
    return (
      restrictedElements.indexOf(element.tagName.toLowerCase()) !== -1 ||
      element.closest(`[${TOLGEE_RESTRICT_ATTRIBUTE}]`) !== null
    );
  }

  function refreshAll() {
    elementStore.forEachElement((element, meta) => {
      if (meta.preventClean) {
        return;
      }
      cleanElementInactiveNodes(meta);
      if (meta.nodes.size === 0) {
        cleanElement(element, meta);
      }
    });
  }

  function findAll(key?: string, ns?: NsFallback) {
    const result: ElementMeta[] = [];
    elementStore.forEachElement((_, meta) => {
      for (const nodeMeta of meta.nodes.values()) {
        const fits = nodeMeta.keys.find((val) =>
          compareDescriptors(
            { key, ns: getFallback(ns) },
            { key: val.key, ns: getFallback(val.ns) }
          )
        );
        if (fits) {
          result.push(meta);
          break;
        }
      }
    });
    return result;
  }

  function cleanElementInactiveNodes(meta: ElementMeta) {
    meta.nodes = new Map(getActiveNodes(meta));
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
    if (meta.highlightEl) {
      meta.unhighlight?.();
    }
    element.removeAttribute(TOLGEE_ATTRIBUTE_NAME);
    elementStore.remove(element);
  }

  function getKeyOptions(meta: ElementMeta): KeyAndParams[] {
    const nodes = Array.from(meta.nodes.values());
    return nodes.reduce(
      (acc, curr) => [
        ...acc,
        ...curr.keys.map((k) => ({
          key: k.key,
          defaultValue: k.defaultValue,
          ns: k.ns,
        })),
      ],
      [] as KeyAndParams[]
    );
  }

  function getKeysAndDefaults(meta: ElementMeta): KeyAndParams[] {
    return getKeyOptions(meta);
  }

  return Object.freeze({
    register,
    forEachElement: elementStore.forEachElement,
    findAll,
    refreshAll,
    run,
    stop,
  });
};

export type ElementRegistryInstance = ReturnType<typeof ElementRegistry>;
