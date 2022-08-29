import { TOLGEE_ATTRIBUTE_NAME } from '../constants';
import { ElementMeta, ElementWithMeta, ObserverOptions } from '../types';

export const DomHelper = (options: ObserverOptions | undefined) => {
  function initParentElement(element: Element): ElementWithMeta {
    if ((element as ElementWithMeta)[TOLGEE_ATTRIBUTE_NAME] === undefined) {
      (element as ElementWithMeta)[TOLGEE_ATTRIBUTE_NAME] = {
        nodes: new Set(),
      } as ElementMeta;
      element.setAttribute(TOLGEE_ATTRIBUTE_NAME, '');
    }

    return element as ElementWithMeta;
  }

  function getParentElement(node: Node): Element | undefined {
    if (node.parentElement) {
      return node.parentElement;
    }
    if ((node as Attr).ownerElement) {
      return (node as Attr).ownerElement || undefined;
    }
  }

  function getAndInitParent(node: Node) {
    const parent = getSuitableParent(node);
    return initParentElement(parent);
  }

  function getSuitableParent(node: Node): Element {
    const domParent = getParentElement(node);

    if (domParent === undefined) {
      // eslint-disable-next-line no-console
      console.error(node);
      throw new Error('No suitable parent found for node above.');
    }

    // if (!this.properties.config.passToParent) {
    return domParent;
    // }

    // if (Array.isArray(this.properties.config.passToParent)) {
    //   const tagNameEquals = (elementTagName: string) =>
    //     domParent.tagName.toLowerCase() === elementTagName.toLowerCase();
    //   if (this.properties.config.passToParent.findIndex(tagNameEquals) === -1) {
    //     return domParent;
    //   }
    // }

    // if (typeof this.properties.config.passToParent === 'function') {
    //   if (!this.properties.config.passToParent(domParent)) {
    //     return domParent;
    //   }
    // }

    // return getSuitableParent(domParent);
  }

  return Object.freeze({
    getAndInitParent,
    getSuitableParent,
  });
};
