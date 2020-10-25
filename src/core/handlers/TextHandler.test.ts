import {ElementWithMeta, NodeWithMeta} from "../types";

jest.dontMock("./TextHandler");
jest.dontMock("./AbstractHandler");
jest.dontMock("../services/EventService");
jest.dontMock("../helpers/NodeHelper.ts");

import {NodeHelper} from "../helpers/NodeHelper";
import describeClassFromContainer from "../../__testFixtures/describeClassFromContainer";
import {TextHandler} from "./TextHandler";
import {createTestDom} from "../../__testFixtures/createTestDom";
import {ReplacedType, TextService} from "../services/TextService";
import {getMockedInstance} from "../../__testFixtures/mocked";
import {Properties} from "../Properties";
import {TranslationHighlighter} from "../TranslationHighlighter";
import { mocked } from "ts-jest/utils";

describe("TextHandler", () => {
    const getTextHandler = describeClassFromContainer(import("./TextHandler"), "TextHandler");
    let basicTextHandler: ReturnType<typeof getTextHandler>;

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
        basicTextHandler = getTextHandler();
        getMockedInstance(TextService).replace = async (...args) => mockedTranslate(...args);
    })

    describe("in production mode", () => {
        beforeEach(async () => {
            await basicTextHandler.handle(document.body);
        });

        test("Can be created", () => {
            expect(basicTextHandler).not.toBeUndefined();
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

        describe("Parent element's _polygloat property", () => {
            let element: ElementWithMeta;
            let node: NodeWithMeta

            beforeEach(() => {
                node = NodeHelper.evaluateToSingle(`./text()[contains(., ${gv(c.keyInRoot)})]`, document.body)
                element = node.parentElement as any as ElementWithMeta;
            });

            test("will be defined", () => {
                expect(element._polygloat).toBeDefined();
            });

            test("will contain nodes array with correct node", () => {
                expect(element._polygloat.nodes).toEqual(new Set([node]));
            });
        });
    });

    describe("In development mode", () => {
        beforeEach(async () => {
            getMockedInstance(Properties).config.mode = "development";
            await basicTextHandler.handle(document.body);
        });

        test("will be registered for highlighting in development mode", () => {
            const node = NodeHelper.evaluateToSingle(`./text()[contains(., ${gv(c.keyInRoot)})]`, document.body)
            const element = node.parentElement as any as ElementWithMeta;

            expect(mocked(getMockedInstance(TranslationHighlighter)).listen).toBeCalledWith(element);
            expect(mocked(getMockedInstance(TranslationHighlighter)).listen).toBeCalledTimes(4);
        });
    });
});