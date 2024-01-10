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

      const walker = document.createTreeWalker(
        node,
        NodeFilter.SHOW_ELEMENT,
        (f) =>
          tagAttributes[(f as Element).tagName.toUpperCase()]?.some((t) =>
            (f as Element).hasAttribute(t)
          ) || tagAttributes['*']?.some((t) => (f as Element).hasAttribute(t))
            ? NodeFilter.FILTER_ACCEPT
            : NodeFilter.FILTER_SKIP
      );
      while (walker.nextNode()) {
        const element = walker.currentNode as Element;
        let attributes = tagAttributes[element.tagName.toUpperCase()] ?? [];
        if ('*' in tagAttributes) {
          attributes = attributes.concat(tagAttributes['*']);
        }
        result.push(
          ...(attributes
            .filter((attrName) => element.hasAttribute(attrName))
            .map((attrName) => element.getAttributeNode(attrName))
            .filter((attrNode) =>
              wrapper.testAttribute(attrNode as Attr)
            ) as Attr[])
        );
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
