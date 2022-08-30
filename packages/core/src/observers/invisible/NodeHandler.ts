import { TOLGEE_WRAPPED_ONLY_DATA_ATTRIBUTE } from '../../constants';
import { ObserverOptions } from '../../types';
import { filterRestricted, xPathEvaluate } from '../general/helpers';
import { INVISIBLE_CHARACTERS } from './secret';

export const NodeHandler = (options: ObserverOptions) => {
  const handleText = (node: Node) => {
    const xPath = `./descendant-or-self::text()[contains(., '${INVISIBLE_CHARACTERS[0]}')]`;
    const nodes = xPathEvaluate(xPath, node);
    const filtered: Text[] = filterRestricted(nodes as Text[]);

    return filtered;
  };

  const handleAttributes = (node: Node) => {
    let result: Attr[] = [];
    for (const [tag, attributes] of Object.entries(options.tagAttributes)) {
      for (const attribute of attributes) {
        const expression = `descendant-or-self::${tag}/@${attribute}[contains(., '${INVISIBLE_CHARACTERS[0]}')]`;
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
