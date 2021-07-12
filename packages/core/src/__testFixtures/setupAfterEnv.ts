jest.dontMock('../helpers/NodeHelper.ts');

import { NodeHelper } from '../helpers/NodeHelper';
const domTestingLib = require('@testing-library/dom');
const { prettyDOM } = domTestingLib;

expect.extend({
  toBeFoundIn(xpath, contextNode) {
    let result = NodeHelper.evaluate(xpath, contextNode);
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
