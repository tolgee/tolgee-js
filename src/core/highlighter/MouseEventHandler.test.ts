jest.dontMock("./MouseEventHandler");
jest.dontMock("../../Constants/ModifierKey");
jest.dontMock("../services/EventEmitter");
jest.dontMock("../services/Subscription");

import {ElementMeta, ElementWithMeta} from "../types";
import describeClassFromContainer from "@testFixtures/describeClassFromContainer";
import {MouseEventHandler} from "./MouseEventHandler";
import {getMockedInstance} from "@testFixtures/mocked";
import {Properties} from "../Properties";
import {ModifierKey} from "../../Constants/ModifierKey";

describe("MouseEventHandler", () => {
    const getMouseEventHandler = describeClassFromContainer(import("./MouseEventHandler"), "MouseEventHandler");
    let mouseEventHandler: ReturnType<typeof getMouseEventHandler>;

    beforeEach(async () => {
        mouseEventHandler = await getMouseEventHandler();
    });

    describe("highlighting", () => {
        let mockedElement: ElementWithMeta;
        const key = "Alt";
        const mockedColor = "rgb(0, 30, 50)"
        const mockedMouseOver = new MouseEvent("mouseover");
        const mockedMouseLeave = new MouseEvent("mouseleave");
        const mockedKeydown = new KeyboardEvent("keydown", {key});
        const mockedKeyup = new KeyboardEvent("keyup", {key});
        const mockedCallback = jest.fn();

        beforeEach(() => {
           mockedElement = document.createElement("div") as Element as ElementWithMeta;
           mockedElement._polygloat = {} as ElementMeta;
           getMockedInstance(Properties).config.highlightKeys = [ModifierKey[key]];
           getMockedInstance(Properties).config.highlightColor = mockedColor;
           mouseEventHandler.handle(mockedElement, mockedCallback);
           mockedElement.dispatchEvent(mockedMouseOver);
           window.dispatchEvent(mockedKeydown);
       })

        test("Will highlight", async () => {
            expect(mockedElement.style.backgroundColor).toEqual(mockedColor);
        });


        test("Will unhighlight", async () => {
            mockedElement.dispatchEvent(mockedMouseLeave);
            expect(mockedElement.style.backgroundColor).toEqual("");
        });

        test("Will reset to correct initial color", async () => {
            mockedElement.dispatchEvent(mockedMouseLeave);
            mockedElement.style.backgroundColor = "#222222"
            mockedElement.dispatchEvent(mockedMouseOver);
            mockedElement.dispatchEvent(mockedMouseLeave);
            expect(mockedElement.style.backgroundColor).toEqual("rgb(34, 34, 34)");
        });

        test("Will not highlight just on mouseover", async () => {
            mockedElement.dispatchEvent(mockedMouseLeave);
            window.dispatchEvent(mockedKeyup);
            mockedElement.dispatchEvent(mockedMouseOver);
            expect(mockedElement.style.backgroundColor).toEqual("");
        });

        test("Will not highlight just on keydown", async () => {
            window.dispatchEvent(mockedKeyup);
            mockedElement.dispatchEvent(mockedMouseLeave);
            window.dispatchEvent(mockedKeydown)
            expect(mockedElement.style.backgroundColor).toEqual("");
        });


        test("Will highlight when keydown first", async () => {
            window.dispatchEvent(mockedKeyup);
            mockedElement.dispatchEvent(mockedMouseLeave);
            window.dispatchEvent(mockedKeydown);
            mockedElement.dispatchEvent(mockedMouseOver);
            expect(mockedElement.style.backgroundColor).toEqual(mockedColor);
        });

        test("Will call callback on click", async () => {
            mockedElement.dispatchEvent(new MouseEvent("click"));
            expect(mockedCallback).toBeCalledTimes(1);
        });

        test("Will not handle single element multiple times", async () => {
            mouseEventHandler.handle(mockedElement, () => {

            });
            mouseEventHandler.handle(mockedElement, () => {

            });
            mockedElement.dispatchEvent(new MouseEvent("click"));
            expect(mockedCallback).toBeCalledTimes(1);
        });

        test("Will clear keys on window blur", async () => {
            window.dispatchEvent(new Event("blur"));
            mockedElement.dispatchEvent(new MouseEvent("click"));
            expect(mockedCallback).not.toBeCalledTimes(1);
        });
    });
});