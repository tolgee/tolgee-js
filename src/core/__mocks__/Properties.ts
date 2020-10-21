import * as Module from "../Properties";
import classMock from "../../__testFixtures/classMock";

const moduleMock = jest.genMockFromModule("../Properties");

export const Properties = classMock<Module.Properties>(() => ({
    config: {
        inputPrefix: "{{",
        inputSuffix: "}}",
        restrictedElements: []
    },
    preferredLanguages: new Set<string>()
}), (moduleMock as typeof Module).Properties);