import describeClassFromContainer from "../../__testFixtures/describeClassFromContainer";
import {getMockedInstance} from "../../__testFixtures/mocked";
import {BasicTextHandler} from "./BasicTextHandler";
import {AttributeHandler} from "./AttributeHandler";
import {EventService} from "../services/EventService";
import {EventEmitter} from "../services/EventEmitter";
import {mocked} from "ts-jest/utils";
import {TranslationData} from "../DTOs/TranslationData";
import {Properties} from "../Properties";
import {ElementMeta, NodeMeta, NodeWithMeta} from "../Types";
import {ReplacedType, TextService} from "../services/TextService";

jest.dontMock("./CoreHandler");
jest.dontMock("../helpers/NodeHelper.ts");
jest.dontMock("../services/EventEmitter");

describe("CoreHandler", () => {
    const mockedTranslationChanged = new EventEmitter<TranslationData>();
    const mockedLanguageChanged = new EventEmitter<string>();

    mocked(EventService).mockImplementation(() => {
        return {
            TRANSLATION_CHANGED: mockedTranslationChanged,
            LANGUAGE_CHANGED: mockedLanguageChanged
        } as EventService
    });

    const mockedReplaceReturn: ReplacedType = {
        keysAndParams: [{} as any],
        newValue: "This is refreshed"
    };

    mocked(TextService).mockImplementation(() => {
        return ({
            replace: jest.fn(() => mockedReplaceReturn)
        } as any as TextService);
    })

    const getCoreHandler = describeClassFromContainer(import("./CoreHandler"), "CoreHandler");
    let coreHandler: ReturnType<typeof getCoreHandler>;
    beforeEach(async () => {
        coreHandler = getCoreHandler();
    });

    test("Can be created", () => {
        expect(coreHandler).not.toBeUndefined();
    });


    describe("handleSubtree function", () => {

        beforeEach(async () => {
            await coreHandler.handleSubtree(document.body);
        })

        test("will call basic text handler", async () => {
            expect(getMockedInstance(BasicTextHandler).handle).toBeCalledWith(document.body);
            expect(getMockedInstance(BasicTextHandler).handle).toBeCalledTimes(1);
        });

        test("will call attribute handler", async () => {
            expect(getMockedInstance(AttributeHandler).handle).toBeCalledWith(document.body);
            expect(getMockedInstance(AttributeHandler).handle).toBeCalledTimes(1);
        });
    });


    describe("refresh", () => {
        const pgDiv = document.createElement("div");
        pgDiv.setAttribute("_polygloat", "");
        const textNode = document.createTextNode("Translated text");
        textNode["_polygloat"] = {oldTextContent: "some_translation_key"} as NodeMeta;
        pgDiv["_polygloat"] = {
            nodes: new Set([textNode as any as NodeWithMeta])
        } as ElementMeta;

        beforeEach(async () => {
            document.body = document.createElement("body");
            document.body.append(pgDiv);
            getMockedInstance(Properties).config.targetElement = document.body;

            await mockedLanguageChanged.emit("aaa");
            await mockedTranslationChanged.emit(null);
        })

        test("will refresh the text", async () => {
            expect(textNode.textContent).toEqual(mockedReplaceReturn.newValue);
        });

    });


});