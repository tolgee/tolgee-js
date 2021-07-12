jest.dontMock('../helpers/NodeHelper.ts');

import { NodeHelper } from '../helpers/NodeHelper';
import { prettyDOM } from '@testing-library/dom';

expect.extend({
  toBeFoundIn(xpath, contextNode) {
    const result = NodeHelper.evaluate(xpath, contextNode);
    if (result.length > 0 && document.contains(result[0])) {
      return {
        message: () =>
          `Xpath ${xpath} should not be found in ${contextNode}\n\n${prettyDOM(
            contextNode
          )}`,
        pass: true,
      };
    }
    return {
      message: () =>
        `Xpath ${xpath} should be found in ${contextNode}\n\n${prettyDOM(
          contextNode
        )}`,
      pass: false,
    };
  },
} as any);
