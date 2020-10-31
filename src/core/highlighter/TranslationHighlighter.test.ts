jest.dontMock("./TranslationHighlighter");

import classMock from "@testFixtures/classMock";
import describeClassFromContainer from "@testFixtures/describeClassFromContainer";
import {MouseEventHandler} from "./MouseEventHandler";
import {getMockedInstance} from "@testFixtures/mocked";
import {TranslationHighlighter} from "./TranslationHighlighter";
import {ElementWithMeta, NodeMeta, NodeWithMeta} from "../types";
import {Properties} from "../Properties";
import {UI} from "../../ui";

describe("TranslationHighlighter", () => {
    const getTranslationHighlighter = describeClassFromContainer(import("./TranslationHighlighter"), "TranslationHighlighter");
    let translationHighlighter: ReturnType<typeof getTranslationHighlighter>;

    test("will start to using mouseEventHandler", () => {
        getMockedInstance(MouseEventHandler).handle = jest.fn();
        const mockedElement = document.createElement("e") as Element;
        translationHighlighter.listen(mockedElement as ElementWithMeta);
        expect(getMockedInstance(MouseEventHandler).handle).toBeCalledTimes(1);
    });


    describe("key rendering", () => {
        test("will open renderer key context menu when multiple nodes", async () => {
            await testNodeCounts(2, 1);
        })


        test("will open renderer key context menu when multiple keys", async () => {
            await testNodeCounts(1, 10);
        });


        test("will open translation dialog when single key", async () => {
            const mockedElement = createElements(1, 1, true);
            translationHighlighter.listen(mockedElement);
            await savedCallback(openEvent);

            expect(rendererViewerMock).toBeCalledTimes(1);
            expect(rendererViewerMock).toBeCalledWith("key");
        });

        test("will open translation dialog when single key multiplied", async () => {
            const mockedElement = createElements(20, 20, true);
            translationHighlighter.listen(mockedElement);
            await savedCallback(openEvent);

            expect(rendererViewerMock).toBeCalledTimes(1);
            expect(rendererViewerMock).toBeCalledWith("key");
        })
    });

    describe("warnings & errors", () => {
        test("will print error on no key", async () => {
            console.error = jest.fn()
            rendererGetKeyMock = jest.fn(async (): Promise<string> => {
                return;
            });

            rendererViewerMock = jest.fn();

            getMockedInstance(Properties).config.ui = classMock<UI>(() => ({
                getKey: rendererGetKeyMock,
            }), UI);

            translationHighlighter.listen(createElements(0, 0));

            await savedCallback(openEvent);

            expect(console.error).toBeCalledTimes(1);
        });

        test("will print error on no key", async () => {
            console.warn = jest.fn()

            getMockedInstance(Properties).config.ui = null;

            translationHighlighter.listen(createElements(1, 1));

            await savedCallback(openEvent);

            expect(console.warn).toBeCalledTimes(1);
        });
    })

    beforeEach(async () => {
        translationHighlighter = await getTranslationHighlighter();
    });

    let savedCallback: (e: MouseEvent) => void;

    const createElements = (nodesCount: number, keysCount: number, sameKeys: boolean = false) => {
        const mockedElement = document.createElement("div") as Element as ElementWithMeta;

        let keyNum = 0;

        const cn = (text) => {
            const node = document.createTextNode(text) as Node as NodeWithMeta;
            const keys = [];

            for (let i = 0; i < keysCount; i++) {
                keys.push({key: `key${sameKeys ? `` : ` ${keyNum++}`}`, params: {a: "aaa"}})
            }
            node._polygloat = {
                oldTextContent: `"${text}" before translation.`,
                keys
            } as NodeMeta
            return node;
        }

        const nodes = [];
        for (let i = 0; i < nodesCount; i++) {
            nodes.push(cn(`text ${i}`));
        }
        mockedElement._polygloat = {
            nodes: new Set(nodes)
        }
        return mockedElement;
    }


    let rendererGetKeyMock: (...args) => Promise<string>;
    let rendererViewerMock: (...args) => void;

    beforeEach(() => {
        rendererGetKeyMock = jest.fn(async (): Promise<string> => {
            return "test";
        });

        rendererViewerMock = jest.fn();

        getMockedInstance(Properties).config.ui = classMock<UI>(() => ({
            getKey: rendererGetKeyMock,
            renderViewer: rendererViewerMock
        }), UI);

        getMockedInstance(MouseEventHandler).handle = (element, callback) => {
            savedCallback = callback;
        }

    });

    const openEvent = new MouseEvent("click");

    const testNodeCounts = async (nodeCount, keyCount) => {
        const mockedElement = createElements(nodeCount, keyCount);
        translationHighlighter.listen(mockedElement);
        savedCallback(openEvent);
        expect(rendererGetKeyMock).toBeCalledTimes(1);

        const keySet = new Set();
        for (let i = 0; i < nodeCount * keyCount; i++) {
            keySet.add(`key ${i}`)
        }

        expect(rendererGetKeyMock).toBeCalledTimes(1);
        expect(rendererGetKeyMock).toBeCalledWith({keys: keySet, openEvent});
        expect(rendererGetKeyMock).not.toBeCalledWith({keys: new Set(["key 0"]), openEvent});
    }

});