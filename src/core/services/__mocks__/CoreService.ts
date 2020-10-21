import * as Module from "../CoreService";
import classMock from "../../../__testFixtures/classMock";
import {Scope} from "../../Types";

const moduleMock = jest.genMockFromModule("../CoreService");

export const CoreService = classMock<Module.CoreService>(() => ({
    getScopes: jest.fn(async () => {
        return ["translations.edit", "sources.edit"] as Scope[];
    })
}), (moduleMock as typeof Module).CoreService);