import {ElementWithMeta, NodeWithMeta} from "../types";
import {NodeHelper} from "../helpers/NodeHelper";
import describeClassFromContainer from "../../__testFixtures/describeClassFromContainer";
import {TextHandler} from "./TextHandler";
import {createTestDom} from "@testFixtures/createTestDom";
import {ReplacedType, TextService} from "../services/TextService";
import {getMockedInstance} from "@testFixtures/mocked";
import {ElementRegistrar} from "../services/ElementRegistrar";

jest.dontMock("./TextHandler");
jest.dontMock("./AbstractHandler");
jest.dontMock("../services/EventService");
jest.dontMock("../helpers/NodeHelper.ts");

describe("TextHandler", () => {
    const getTextHandler = describeClassFromContainer(import("./TextHandler"), "TextHandler");
    let textHandler: ReturnType<typeof getTextHandler>;

    const mockedKeys = [{
        key: "dummyKey",
        params: {dummyParam: "dummyValue"}
    }];

    const mockedTranslateInner = (text) => {
        return {
            text: text.replace(/{{(.*?)}}/gs, "$1"),
            keys: mockedKeys
        } as ReplacedType
    }

    const gv = (key) => mockedTranslateInner(key).text;
    const mockedTranslate = jest.fn(mockedTranslateInner);
    let c: ReturnType<typeof createTestDom>;

    beforeEach(() => {
        c = createTestDom(document);
        textHandler = getTextHandler();
        getMockedInstance(TextService).replace = async (...args) => mockedTranslate(...args);
    })

    describe("in production mode", () => {
        beforeEach(async () => {
            await textHandler.handle(document.body);
        });

        test("Can be created", () => {
            expect(textHandler).not.toBeUndefined();
        });

        test("will handle text in root", async () => {
            expect(`./text()[contains(., ${gv(c.keyInRoot)})]`).toBeFoundIn(document.body);
        });

        test("will handle text in div", async () => {
            expect(`./div/text()[contains(., 'Some trash... ${gv(c.keyInRootDiv)}')]`).toBeFoundIn(document.body);
        });

        test("will handle text in div > div > span", async () => {
            const xpath = `./div/div/span/text()[contains(., '${gv(c.hereKey)} and ${gv(c.hereTooKey)}')]`;
            expect(xpath).toBeFoundIn(document.body);
        });


        describe("Node's _polygloat property", () => {
            let node: NodeWithMeta;

            beforeEach(() => {
                node = NodeHelper.evaluateToSingle(`./text()[contains(., ${gv(c.keyInRoot)})]`, document.body) as NodeWithMeta;
            });

            test("will be defined", () => {
                expect(node._polygloat).toBeDefined();
            });

            test("will have proper oldTextContent", () => {
                expect(node._polygloat.oldTextContent).toContain(`{{${c.keyInRoot}}}`);
            });

            test("will have proper keys length", () => {
                expect(node._polygloat.keys).toHaveLength(1);
            });

            test("will have proper first key", () => {
                expect(node._polygloat.keys).toEqual(mockedKeys);
            });
        });

        describe("Parent element's _polygloat property and attribute", () => {
            let element: ElementWithMeta;
            let node: NodeWithMeta

            beforeEach(() => {
                node = NodeHelper.evaluateToSingle(`./text()[contains(., ${gv(c.keyInRoot)})]`, document.body)
                element = node.parentElement as any as ElementWithMeta;
            });

            test("property will be defined", () => {
                expect(element._polygloat).toBeDefined();
            });

            test("will contain nodes array with correct node", () => {
                expect(element._polygloat.nodes).toEqual(new Set([node]));
            });

            test("attribute will be set", () => {
                expect(element.getAttribute("_polygloat")).toEqual("");
            });
        });
    });

    test("will register the node", async () => {
        await textHandler.handle(document.body);
        const node = NodeHelper.evaluateToSingle(`./text()[contains(., ${gv(c.keyInRoot)})]`, document.body)
        expect(getMockedInstance(ElementRegistrar).register).toBeCalledWith(node.parentElement);
    })
});