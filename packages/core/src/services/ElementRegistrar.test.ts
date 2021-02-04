import {ElementWithMeta, NodeWithMeta} from "../types";

jest.dontMock("./ElementRegistrar");

import describeClassFromContainer from "@testFixtures/describeClassFromContainer";
import {getMockedInstance} from "@testFixtures/mocked";
import {ElementRegistrar} from "./ElementRegistrar";
import {TranslationHighlighter} from "../highlighter/TranslationHighlighter";
import {createElement} from "@testFixtures/createElement";
import {Properties} from "../Properties";
import {POLYGLOAT_ATTRIBUTE_NAME} from "../Constants/Global";

describe("ElementRegistrar", () => {
    const getElementRegistrar = describeClassFromContainer(import("./ElementRegistrar"), "ElementRegistrar");
    let elementRegistrar: ReturnType<typeof getElementRegistrar>;

    beforeEach(async () => {
        elementRegistrar = await getElementRegistrar();
        getMockedInstance(Properties).config.targetElement = document.body;
    });

    describe("In development mode", () => {
        const element = createElement(1, 1);

        beforeEach(async () => {
            getMockedInstance(Properties).config.mode = "development";
            document.body.append(element);
            await elementRegistrar.register(element);

        });

        test("will be registered for highlighting in development mode", () => {
            expect(getMockedInstance(TranslationHighlighter).listen).toBeCalledWith(element);
            expect(getMockedInstance(TranslationHighlighter).listen).toBeCalledTimes(1);
        });
    });

    test("throws error on register element without any node", async () => {
        const element = createElement(0, 0);
        getMockedInstance(Properties).config.mode = "development";
        document.body.append(element);
        expect(() => elementRegistrar.register(element)).toThrowError();
    });

    describe("register, clean & refresh methods", () => {
        let mockedElements: ElementWithMeta[];
        beforeEach(() => {
            mockedElements = [
                createElement(5, 0),
                createElement(1, 0),
                createElement(3, 0),
            ];
            document.body.append(...mockedElements);
            mockedElements.forEach(e => elementRegistrar.register(e));
        });

        test("refresh all will remove inactive elements", () => {
            const node = mockedElements[1]._tolgee.nodes.values().next().value;
            node.parentElement.removeChild(node);
            elementRegistrar.refreshAll();
            expect(mockedElements[1]._tolgee).not.toBeDefined();
            expect(mockedElements[1]).not.toHaveAttribute(POLYGLOAT_ATTRIBUTE_NAME);
        });

        test("refresh all will remove inactive nodes", () => {
            const node = mockedElements[2]._tolgee.nodes.values().next().value;
            node.parentElement.removeChild(node);
            elementRegistrar.refreshAll();
            expect(mockedElements[2]._tolgee.nodes.size).toEqual(2);
        });

        test("removal will call remove all event listeners method", () => {
            const mockedCallback = jest.fn();
            mockedElements[1]._tolgee.removeAllEventListeners = mockedCallback;
            const node = mockedElements[1]._tolgee.nodes.values().next().value;
            node.parentElement.removeChild(node);
            elementRegistrar.refreshAll();
            expect(mockedCallback).toBeCalledTimes(1);
        });

        test("clean all will clean all elements", () => {
            elementRegistrar.cleanAll();
            for (const mockedElement of mockedElements) {
                expect(mockedElement._tolgee).not.toBeDefined();
            }
        });
    });

    test("will register attribute node", () => {
        const inputElement = document.createElement("input") as any as ElementWithMeta;
        document.body.append(inputElement);
        inputElement.setAttribute("_tolgee", "");
        inputElement.setAttribute("placeholder", "Text")
        inputElement._tolgee = {
            nodes: new Set([inputElement.attributes["placeholder"]])
        }
        elementRegistrar.register(inputElement);
    })
});