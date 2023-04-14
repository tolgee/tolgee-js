import { ObserverOptions } from '@tolgee/core';

export function DomHelper(options: ObserverOptions) {
  function getParentElement(node: Node): Element | undefined {
    if (node.parentElement) {
      return node.parentElement;
    }
    if ((node as Attr).ownerElement) {
      return (node as Attr).ownerElement || undefined;
    }
  }

  const self = Object.freeze({
    getSuitableParent(node: Node): Element {
      const domParent = getParentElement(node);

      if (domParent === undefined) {
        // eslint-disable-next-line no-console
        console.error(node);
        throw new Error('No suitable parent found for node above.');
      }

      if (!options.passToParent) {
        return domParent;
      }

      if (Array.isArray(options.passToParent)) {
        const tagNameEquals = (elementTagName: string) =>
          domParent.tagName.toLowerCase() === elementTagName.toLowerCase();
        if (options.passToParent.findIndex(tagNameEquals) === -1) {
          return domParent;
        }
      }

      if (typeof options.passToParent === 'function') {
        if (!options.passToParent(domParent)) {
          return domParent;
        }
      }

      return self.getSuitableParent(domParent);
    },
  });

  return self;
}
