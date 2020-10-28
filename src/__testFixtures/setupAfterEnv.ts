jest.dontMock("../core/helpers/NodeHelper.ts");
import {NodeHelper} from "../core/helpers/NodeHelper";

const domTestingLib = require('@testing-library/dom')
const {prettyDOM} = domTestingLib

expect.extend({
    toBeFoundIn(xpath, contextNode) {
        let result = NodeHelper.evaluateToSingle(xpath, contextNode);
        if (result && document.contains(result)) {
            return {
                message: () => `Xpath ${xpath} should not be found in ${contextNode}\n\n${prettyDOM(contextNode)}`,
                pass: true
            }
        }
        return {
            message: () => `Xpath ${xpath} should be found in ${contextNode}\n\n${prettyDOM(contextNode)}`,
            pass: false
        }
    }
} as any);