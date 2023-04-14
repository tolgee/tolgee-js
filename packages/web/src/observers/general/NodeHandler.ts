import { ObserverOptionsInternal, WrapperMiddleware } from '@tolgee/core';
import { xPathEvaluate } from './helpers';

export function NodeHandler(
  options: ObserverOptionsInternal,
  wrapper: WrapperMiddleware
) {
  const self = Object.freeze({
    handleAttributes(node: Node) {
      let result: Attr[] = [];
      for (const [tag, attributes] of Object.entries(options.tagAttributes)) {
        for (const attribute of attributes) {
          const expression = wrapper.getAttributeXPath({ tag, attribute });
          const nodes = xPathEvaluate(expression, node) as Attr[];
          result = [...result, ...nodes];
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
      const xPath = wrapper.getTextXPath();
      const nodes = xPathEvaluate(xPath, node);
      return nodes as Text[];
    },
  });

  return self;
}

export type NodeHandlerInstance = ReturnType<typeof NodeHandler>;
