import { ObserverOptionsInternal, WrapperMiddleware } from '@tolgee/core';
import { xPathEvaluate } from './helpers';

export const NodeHandler = (
  options: ObserverOptionsInternal,
  wrapper: WrapperMiddleware
) => {
  const handleText = (node: Node) => {
    const xPath = wrapper.getTextXPath();
    const nodes = xPathEvaluate(xPath, node);
    return nodes as Text[];
  };

  const handleAttributes = (node: Node) => {
    let result: Attr[] = [];
    for (const [tag, attributes] of Object.entries(options.tagAttributes)) {
      for (const attribute of attributes) {
        const expression = wrapper.getAttributeXPath({ tag, attribute });
        const nodes = xPathEvaluate(expression, node) as Attr[];
        result = [...result, ...nodes];
      }
    }
    return result;
  };

  const handleChildList = (node: Node) => {
    let result: (Attr | Text)[] = [];
    result = result.concat(handleAttributes(node));
    result = result.concat(handleText(node));
    // wrappedHandler(node);
    return result;
  };

  return Object.freeze({
    handleAttributes,
    handleChildList,
    handleText,
  });
};

export type NodeHandlerInstance = ReturnType<typeof NodeHandler>;
