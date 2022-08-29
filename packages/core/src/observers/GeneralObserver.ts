import { INVISIBLE_CHARACTERS } from './invisible/secret';
import {
  xPathEvaluate,
  filterRestricted,
  getNodeText,
  translateChildNode,
} from './helpers';

import {
  TOLGEE_ATTRIBUTE_NAME,
  TOLGEE_WRAPPED_ONLY_DATA_ATTRIBUTE,
} from '../constants';
import {
  ModifierKey,
  NodeLock,
  NodeMeta,
  ObserverOptions,
  ObserverOptionsInitial,
  WrapperPlugin,
} from '../types';
import { DomHelper } from './DomHelper';
import { ElementRegistrar } from './ElementRegistrar';

const defaultOptions: ObserverOptions = {
  tagAttributes: {
    textarea: ['placeholder'],
    input: ['value', 'placeholder'],
    img: ['alt'],
    '*': ['aria-label', 'title'],
  },
  highlightKeys: [ModifierKey.Alt] as ModifierKey[],
  highlightColor: 'rgb(255, 0, 0)',
  highlightWidth: 5,
  targetElement: document.body,
};

export const GeneralObserver = (
  wrapper: ReturnType<WrapperPlugin>,
  options?: ObserverOptionsInitial
) => {
  let isObserving = true;

  const observerOptions: ObserverOptions = { ...defaultOptions, ...options };
  const domHelper = DomHelper(observerOptions);

  const elementRegistrar = ElementRegistrar(observerOptions);

  const handleText = (node: Node) => {
    const xPath = `./descendant-or-self::text()[contains(., '${INVISIBLE_CHARACTERS[0]}')]`;
    const nodes = xPathEvaluate(xPath, node);
    const filtered: Text[] = filterRestricted(nodes as Text[]);

    handleNodes(filtered);
  };

  const handleAttributes = (node: Node) => {
    for (const [tag, attributes] of Object.entries(
      observerOptions.tagAttributes
    )) {
      for (const attribute of attributes) {
        const expression = `descendant-or-self::${tag}/@${attribute}[contains(., '${INVISIBLE_CHARACTERS[0]}')]`;
        const nodes = xPathEvaluate(expression, node) as Attr[];
        handleNodes(nodes);
      }
    }
  };

  const wrappedHandler = (node: Node) => {
    const xPath = `./descendant-or-self::*[@${TOLGEE_WRAPPED_ONLY_DATA_ATTRIBUTE}]`;
    const nodes = xPathEvaluate(xPath, node);
    const filtered: Element[] = filterRestricted(nodes as Element[]);
    filtered.forEach((element) => {
      const elementWithMeta = domHelper.getAndInitParent(element);
      elementWithMeta._tolgee.wrappedWithElementOnlyKey =
        element.getAttribute(TOLGEE_WRAPPED_ONLY_DATA_ATTRIBUTE) || undefined;
      elementWithMeta._tolgee.wrappedWithElementOnlyDefaultHtml =
        element.innerHTML;
      elementRegistrar.register(elementWithMeta);
    });
  };

  const handleChildList = (node: Node) => {
    handleAttributes(node);
    handleText(node);
    wrappedHandler(node);
  };

  function handleNodes(nodes: Array<Text | Attr>) {
    for (const textNode of nodes) {
      if ((textNode as any)[TOLGEE_ATTRIBUTE_NAME] === undefined) {
        (textNode as any)[TOLGEE_ATTRIBUTE_NAME] = {} as NodeLock;
      }
      const tolgeeData = (textNode as any)[TOLGEE_ATTRIBUTE_NAME] as
        | NodeMeta
        | undefined;
      if (tolgeeData?.locked !== true) {
        const text = getNodeText(textNode);
        const result = text !== null ? wrapper.unwrap(text) : null;
        if (result) {
          const { text, keys } = result;
          const translatedNode = translateChildNode(textNode, text, keys);
          const parentElement = domHelper.getAndInitParent(translatedNode);
          parentElement._tolgee.nodes.add(translatedNode);
          elementRegistrar.register(parentElement);
        }
      }
    }
  }

  const observer = new MutationObserver((mutationsList: MutationRecord[]) => {
    if (!isObserving) {
      return;
    }
    for (const mutation of mutationsList) {
      switch (mutation.type) {
        case 'characterData':
          handleText(mutation.target);
          break;

        case 'childList':
          handleChildList(mutation.target);
          break;

        case 'attributes':
          handleAttributes(mutation.target);
          break;
      }
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
