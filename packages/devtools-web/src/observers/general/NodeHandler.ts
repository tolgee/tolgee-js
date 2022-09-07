import { TOLGEE_WRAPPED_ONLY_DATA_ATTRIBUTE } from '@tolgee/core';
import { ObserverOptions, WrapperInterface } from '@tolgee/core';
import { filterRestricted, xPathEvaluate } from '../general/helpers';

export const NodeHandler = (
  options: ObserverOptions,
  wrapper: WrapperInterface
) => {
  const handleText = (node: Node) => {
    const xPath = wrapper.getTextXPath();
    const nodes = xPathEvaluate(xPath, node);
    const filtered: Text[] = filterRestricted(nodes as Text[]);

    return filtered;
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

  const wrappedHandler = (node: Node) => {
    const xPath = `./descendant-or-self::*[@${TOLGEE_WRAPPED_ONLY_DATA_ATTRIBUTE}]`;
    const nodes = xPathEvaluate(xPath, node);
    const filtered: Element[] = filterRestricted(nodes as Element[]);
    filtered.forEach((element) => {
      // const elementWithMeta = domHelper.getAndInitParent(element);
      // elementWithMeta._tolgee.wrappedWithElementOnlyKey =
      //   element.getAttribute(TOLGEE_WRAPPED_ONLY_DATA_ATTRIBUTE) || undefined;
      // elementWithMeta._tolgee.wrappedWithElementOnlyDefaultHtml =
      //   element.innerHTML;
      // elementRegistrar.register(elementWithMeta);
    });
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
