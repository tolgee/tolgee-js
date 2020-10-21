import describeClassFromContainer from "../../__testFixtures/describeClassFromContainer";
import {getMockedInstance} from "../../__testFixtures/mocked";
import {BasicTextHandler} from "./BasicTextHandler";
import {Properties} from "../Properties";

jest.dontMock("./CoreHandler");
jest.dontMock("../services/EventService");
jest.dontMock("../helpers/NodeHelper.ts");

describe("BasicTextHandler", () => {
    const getCoreHandler = describeClassFromContainer(import("./BasicTextHandler"), "BasicTextHandler");
    let coreHandler: ReturnType<typeof getCoreHandler>;

    beforeEach(async () => {
        coreHandler = getCoreHandler();
    });

    test("Can be created", () => {
        expect(coreHandler).not.toBeUndefined();
    });


    describe("handleSubtree function", () => {
        let texts: HTMLDivElement;
        let text
        beforeEach(() => {
            getMockedInstance(Properties).config.inputPrefix = "{{"
            getMockedInstance(Properties).config.inputSuffix = "}}"
            document.body.innerHTML = `
            <div>
                <input>
                <textarea></textarea>
                <div id='texts'></div>
            </div>
            `;
            texts = document.getElementById("texts") as HTMLDivElement;
            text = document.createTextNode("{{aaa}}");
            texts.append(text);
        });


    });
});