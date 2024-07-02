import {
  NsFallback,
  ObserverRunProps,
  Unwrapped,
  WrapperMiddleware,
  WrapperWrapProps,
  KeyPosition,
  getFallback,
} from '@tolgee/core';

import { TOLGEE_WRAPPED_ONLY_DATA_ATTRIBUTE } from '../../constants';
import { isSSR } from '../../tools/isSSR';
import { ElementMeta, TolgeeElement } from '../../types';
import { DomHelper } from './DomHelper';
import { initNodeMeta } from './ElementMeta';
import { ElementRegistry, ElementRegistryInstance } from './ElementRegistry';
import { ElementStore } from './ElementStore';
import { compareDescriptors, getNodeText, setNodeText } from './helpers';
import { NodeHandler } from './NodeHandler';

type RunningInstance = {
  stop: () => void;
  elementRegistry?: ElementRegistryInstance;
  wrapper: WrapperMiddleware;
};

type RunProps = ObserverRunProps & {
  wrapper: WrapperMiddleware;
};

export function GeneralObserver() {
  let isObserving = false;
  let instance: RunningInstance | undefined;

  const elementStore = ElementStore();

  function createRunningInstance({
    mouseHighlight,
    options,
    wrapper,
    onClick,
  }: RunProps): RunningInstance | undefined {
    if (isSSR()) {
      return {
        stop() {
          isObserving = false;
        },
        wrapper,
      };
    }
    const domHelper = DomHelper(options);
    const nodeHandler = NodeHandler(options, wrapper);
    const elementRegistry = ElementRegistry(options, elementStore, onClick);

    function handleNodes(nodes: Array<Text | Attr>) {
      for (const textNode of nodes) {
        const parent = textNode.parentElement;

        if (parent && elementRegistry.isRestricted(parent)) {
          continue;
        }

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

    function handleKeyAttributeAttr(attr: Attr) {
      const parentElement = domHelper.getSuitableParent(attr);
      elementRegistry.register(parentElement, attr, {
        oldTextContent: '',
        keys: [{ key: getNodeText(attr)! }],
        keyAttributeOnly: true,
      });
    }

    function handleKeyAttribute(node: Node, includeChild: boolean) {
      if (node.nodeType === Node.ATTRIBUTE_NODE) {
        const attr = node as Attr;
        if (attr.name === TOLGEE_WRAPPED_ONLY_DATA_ATTRIBUTE) {
          handleKeyAttributeAttr(attr);
          return;
        }
      }

      if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as Element;
        const attr = element.getAttributeNode(
          TOLGEE_WRAPPED_ONLY_DATA_ATTRIBUTE
        ) as Attr;
        if (attr) {
          handleKeyAttributeAttr(attr);
        }
      }

      if (!includeChild) {
        return;
      }

      const walker = document.createTreeWalker(
        node,
        NodeFilter.SHOW_ELEMENT,
        (e) =>
          (e as Element).hasAttribute(TOLGEE_WRAPPED_ONLY_DATA_ATTRIBUTE)
            ? NodeFilter.FILTER_ACCEPT
            : NodeFilter.FILTER_SKIP
      );
      while (walker.nextNode()) {
        const attr = (walker.currentNode as Element).getAttributeNode(
          TOLGEE_WRAPPED_ONLY_DATA_ATTRIBUTE
        ) as Node;
        handleKeyAttributeAttr(attr as Attr);
      }
    }

    const observer = new MutationObserver((mutationsList: MutationRecord[]) => {
      if (!isObserving) {
        return;
      }

      const removedNodes = mutationsList
        .filter((m) => m.type === 'childList')
        .flatMap((m) => Array.from(m.removedNodes));
      const removedNodesSet = new Set(removedNodes);

      for (const node of removedNodes) {
        if (node.nodeType === Node.ELEMENT_NODE) {
          for (let i = 0; i < (node as Element).attributes.length; i++) {
            removedNodesSet.add((node as Element).attributes[i]);
          }
        }

        const treeWalker = document.createTreeWalker(
          node,
          NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT
        );
        while (treeWalker.nextNode()) {
          const currentNode = treeWalker.currentNode;
          if (currentNode.nodeType === Node.ELEMENT_NODE) {
            const element = currentNode as Element;
            for (let i = 0; i < element.attributes.length; i++) {
              removedNodesSet.add(element.attributes[i]);
            }
          }
          removedNodesSet.add(currentNode);
        }
      }

      if (removedNodesSet.size > 0) {
        elementRegistry.cleanupRemovedNodes(removedNodesSet);
      }

      if (
        mutationsList.some(
          (m) =>
            m.type === 'attributes' &&
            m.attributeName === TOLGEE_WRAPPED_ONLY_DATA_ATTRIBUTE
        )
      ) {
        elementRegistry.cleanupLingeringKeyAttributes();
      }

      const result: Set<Attr | Text> = new Set();
      for (const mutation of mutationsList) {
        switch (mutation.type) {
          case 'characterData':
            nodeHandler
              .handleText(mutation.target)
              .forEach((t) => result.add(t));
            break;

          case 'childList':
            handleKeyAttribute(mutation.target, true);
            if (mutation.addedNodes.length > 0) {
              nodeHandler
                .handleChildList(Array.from(mutation.addedNodes))
                .forEach((t) => result.add(t));
            }
            if (mutation.removedNodes.length > 0) {
              nodeHandler
                .handleChildList(Array.from(mutation.removedNodes))
                .forEach((t) => result.delete(t));
            }
            break;

          case 'attributes':
            if (mutation.attributeName === TOLGEE_WRAPPED_ONLY_DATA_ATTRIBUTE) {
              handleKeyAttribute(mutation.target, false);
            }
            nodeHandler
              .handleAttributes(mutation.target, false)
              .forEach((t) => result.add(t));
            break;
        }
      }
      handleNodes([...result]);
    });

    const targetElement = options.targetElement || document;
    isObserving = true;
    elementRegistry.run(mouseHighlight);

    // initially go through all elements
    handleKeyAttribute(targetElement, true);
    handleNodes(nodeHandler.handleChildList([targetElement]));

    const monitorAttributeList = new Set<string>();
    monitorAttributeList.add(TOLGEE_WRAPPED_ONLY_DATA_ATTRIBUTE);
    Object.values(options.tagAttributes).forEach((attrs) =>
      attrs.forEach((attr) => monitorAttributeList.add(attr.toLowerCase()))
    );

    // then observe for changes
    observer.observe(targetElement, {
      attributes: true,
      attributeFilter: [...monitorAttributeList],
      childList: true,
      subtree: true,
      characterData: true,
    });

    return {
      stop() {
        isObserving = false;
        elementRegistry.stop();
        observer.disconnect();
      },
      elementRegistry,
      wrapper,
    };
  }

  const self = Object.freeze({
    run(props: RunProps) {
      instance = createRunningInstance(props);
    },

    stop() {
      instance?.stop();
    },

    forEachElement(callback: (el: TolgeeElement, meta: ElementMeta) => void) {
      instance?.elementRegistry?.forEachElement?.(callback);
    },

    highlight(key?: string, ns?: NsFallback) {
      const elements = instance?.elementRegistry?.findAll(key, ns) || [];
      elements.forEach((el) => el.highlight?.());
      return {
        unhighlight() {
          elements.forEach((el) => el.unhighlight?.());
        },
      };
    },

    findPositions(key?: string, ns?: NsFallback) {
      const elements = instance?.elementRegistry?.findAll(key, ns) || [];
      const result: KeyPosition[] = [];
      // sort elements by their position in the dom
      elements.sort((a, b) => {
        if (
          a.element.compareDocumentPosition(b.element) &
          Node.DOCUMENT_POSITION_FOLLOWING
        ) {
          return -1;
        } else {
          return 1;
        }
      });
      elements.forEach((meta) => {
        const shape = meta.element.getBoundingClientRect();
        meta.nodes.forEach((node) => {
          node.keys.forEach((val) => {
            if (
              compareDescriptors(
                { key, ns: getFallback(ns) },
                { key: val.key, ns: getFallback(val.ns) }
              )
            )
              result.push({
                position: {
                  x: shape.x,
                  y: shape.y,
                  width: shape.width,
                  height: shape.height,
                },
                keyName: val.key,
                keyNamespace: val.ns || '',
              });
          });
        });
      });
      return result;
    },

    unwrap(text: string): Unwrapped {
      if (instance) {
        return instance.wrapper.unwrap(text);
      }
      return {
        text,
        keys: [],
      };
    },

    wrap(props: WrapperWrapProps): string {
      if (instance) {
        return instance.wrapper.wrap(props);
      }
      return props.translation || '';
    },
  });

  return self;
}

export type GeneralObserverType = ReturnType<typeof GeneralObserver>;
