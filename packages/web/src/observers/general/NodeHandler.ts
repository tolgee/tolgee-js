import { ObserverOptionsInternal, WrapperMiddleware } from '@tolgee/core';

export function NodeHandler(
  options: ObserverOptionsInternal,
  wrapper: WrapperMiddleware
) {
  const self = Object.freeze({
    handleAttributes(node: Node) {
      const result: Attr[] = [];

      const tagAttributes = Object.fromEntries(
        Object.entries(options.tagAttributes).map(([tag, attributes]) => [
          tag.toUpperCase(),
          attributes,
        ])
      ) as Record<string, string[]>;

      const tags = new Set(Object.keys(tagAttributes));
      const walker = document.createTreeWalker(
        node,
        NodeFilter.SHOW_ELEMENT,
        (f) =>
          tags.has((f as Element).tagName.toUpperCase())
            ? NodeFilter.FILTER_ACCEPT
            : NodeFilter.FILTER_SKIP
      );
      while (walker.nextNode()) {
        const element = walker.currentNode as Element;
        const attributes = tagAttributes[element.tagName.toUpperCase()];
        for (const attribute of attributes) {
          if (!element.hasAttribute(attribute)) {
            continue;
          }
          const attr = element.getAttributeNode(attribute);
          if (attr && wrapper.testAttribute(attr)) {
            result.push(attr);
          }
        }
      }

      return result;
    },

    handleChildList(node: Node) {
      let result: (Attr | Text)[] = [];
      result = result.concat(self.handleAttributes(node));
      result = result.concat(self.handleText(node));
      // wrappedHandler(node);
      return result;
    },

    handleText(node: Node) {
      if (node.nodeType === Node.TEXT_NODE) {
        return wrapper.testTextNode(node as Text) ? [node as Text] : [];
      }

      const walker = document.createTreeWalker(
        node,
        NodeFilter.SHOW_TEXT,
        (f) =>
          wrapper.testTextNode(f as Text)
            ? NodeFilter.FILTER_ACCEPT
            : NodeFilter.FILTER_SKIP
      );
      const nodes = [];
      while (walker.nextNode()) {
        nodes.push(walker.currentNode);
      }
      return nodes as Text[];
    },
  });

  return self;
}

export type NodeHandlerInstance = ReturnType<typeof NodeHandler>;
