jest.dontMock("./TextService");
jest.dontMock("../helpers/TextHelper");

import describeClassFromContainer from "@testFixtures/describeClassFromContainer";
import {getMockedInstance} from "@testFixtures/mocked";
import {TranslationService} from "./TranslationService";

describe("AttributeHandler", () => {
    const getTextService = describeClassFromContainer(import("./TextService"), "TextService");
    const mockedTranslationReturn = "Dummy translated text {{param1}} {{param2}}";
    const params = {param1: "Dummy param 1", param2: "Dummy param 2"};
    const expectedTranslated = mockedTranslationReturn.replace("{{param1}}", params.param1).replace("{{param2}}", params.param2);
    let textService: ReturnType<typeof getTextService>;


    beforeEach(async () => {
        textService = await getTextService();
        getMockedInstance(TranslationService).getTranslation = jest.fn(async () => {
            return mockedTranslationReturn;
        });

        getMockedInstance(TranslationService).getFromCacheOrFallback = jest.fn(() => {
            return mockedTranslationReturn;
        });
    });

    describe("translation functions", () => {
        test("it will translate asynchronously correctly", async () => {
            const translated = await textService.translate(mockedTranslationReturn, params);
            expect(translated).toEqual(expectedTranslated);
        });

        test("it will translate synchronously correctly", () => {
            const translated = textService.instant(mockedTranslationReturn, params);
            expect(translated).toEqual(expectedTranslated);
        });
    });

    test("replace function replaces occurrences correctly", async () => {
        const text = "This is text with params {{text:param1:hello,param2:hello 2 as well}}. Text continues";
        const replaced = await textService.replace(text);
        expect(replaced.text).toEqual("This is text with params Dummy translated text hello hello 2 as well. Text continues");
        expect(replaced.keys[0].key).toEqual("text");
        expect(replaced.keys[0].params["param1"]).toEqual("hello");
        expect(replaced.keys[0].params["param2"]).toEqual("hello 2 as well");
    });


    test("Will replace repeated parameters", async () => {
        getMockedInstance(TranslationService).getTranslation = jest.fn(async () => {
            return "Text with {{param1}} {{param1}}";
        });

        const text = "This is text: {{text:param1:hello}}";
        const replaced = await textService.replace(text);
        expect(replaced.text).toEqual("This is text: Dummy translated text hello {{param2}}");
    });

    test("replace function does not replace when prefix is escaped", async () => {
        const text = "This is text: {{text:param1:aaaa,param2:aaaa}} \\{{text}}";
        const replaced = await textService.replace(text);
        expect(replaced.text).toEqual("This is text: Dummy translated text aaaa aaaa {{text}}");
    });

    test("replace function does not translate when params have escaped , or :", async () => {
        const text = "This is text: {{text:param1:param 1 with\\,and \\:.,param2:hello \\:}}. Text continues";
        const replaced = await textService.replace(text);
        expect(replaced.text).toEqual("This is text: Dummy translated text param 1 with,and :. hello :. Text continues");
    });

    test("replace function does not translate when params have escaped \\", async () => {
        const text = "This is text: {{text:param1:param 1 with\\\\ and again \\\\,param2:hello \\\\}}. Text continues";
        const replaced = await textService.replace(text);
        expect(replaced.text).toEqual("This is text: Dummy translated text param 1 with\\ and again \\ hello \\. Text continues");
    });


    describe("Different key occurrences", () => {
        beforeEach(() => {
            getMockedInstance(TranslationService).getFromCacheOrFallback = jest.fn(() => {
                return "translated";
            });
        });

        test("longer text will be handled correctly", async () => {
            const text = "This is standard text to translate: {{text}}. This is another one: {{text}}.\n" +
                "There is an text with slash before, but escaped: \\\\{{text}}\n" +
                "This is one with escaped prefix, to it shall not translate this one: \\{{aaa}}\n" +
                "There is another text: {{text}}\n" +
                "There are two texts to translate next to each other: {{text}}{{text}}. And after it text continues: {{text}}.\n" +
                "This is an end, finally.\n";

            const replaced = await textService.replace(text);

            expect(replaced.text).toEqual("This is standard text to translate: translated. This is another one: translated.\n" +
                "There is an text with slash before, but escaped: \\translated\n" +
                "This is one with escaped prefix, to it shall not translate this one: {{aaa}}\n" +
                "There is another text: translated\n" +
                "There are two texts to translate next to each other: translatedtranslated. And after it text continues: translated.\n" +
                "This is an end, finally.\n");
        });

        test("will translate correctly when the text begins with key", async () => {
            const text = "{{text}}, text continues";
            const replaced = await textService.replace(text);
            expect(replaced.text).toEqual("translated, text continues");
        });

        test("will not translate when there is nothing to translate", async () => {
            const text = "\\{{text}}, text continues";
            const replaced = await textService.replace(text);
            expect(replaced).toEqual(undefined);
        });

        test("will not translate when the text begins with escaped key", async () => {
            const text = "\\{{text}}, text continues {{other text}}";
            const replaced = await textService.replace(text);
            expect(replaced.text).toEqual("{{text}}, text continues translated");
        });

        test("will translate when the text begins with escaped escape character", async () => {
            const text = "\\\\{{text}}, text continues {{other text}}";
            const replaced = await textService.replace(text);
            expect(replaced.text).toEqual("\\translated, text continues translated");
        });

        test("will translate when the text begins with escaped escape character, what is escaped", async () => {
            const text = "\\\\\\{{text}}, text continues {{other text}}";
            const replaced = await textService.replace(text);
            expect(replaced.text).toEqual("\\{{text}}, text continues translated");
        });
    });

    describe("wrap function", () => {
        test("will correctly wrap text without params", () => {
            expect(textService.wrap("text")).toEqual("{{text}}");
        });


        test("will correctly wrap text with , and :", () => {
            expect(textService.wrap("text, other text: yes!")).toEqual("{{text\\, other text\\: yes!}}");
        });

        test("will correctly wrap text with ,, : and \\", () => {
            expect(textService.wrap("text, other text: \\ yes!")).toEqual("{{text\\, other text\\: \\\\ yes!}}");
        });


        test("will correctly wrap text with parameters", () => {
            expect(textService.wrap("text", {param1: "the param value", param2: "2nd value"}))
                .toEqual("{{text:param1:the param value,param2:2nd value}}");
        });

        test("will correctly wrap text with parameters containing : an ,", () => {
            expect(textService.wrap("text", {param1: "the param value: value, value2 or value3", param2: "2nd value"}))
                .toEqual("{{text:param1:the param value\\: value\\, value2 or value3,param2:2nd value}}");
        });

        test("it will correctly replace wrapped text", async () => {
            getMockedInstance(TranslationService).getFromCacheOrFallback = jest.fn(() => {
                return "xxx {{param1}} {{param2}} xxx";
            });

            const wrapped = textService.wrap(
                "An longer key with some strange ,: ,: \\ characters",
                {param1: ",:,:", param2: "....\\...,"}
            );

            expect((await textService.replace(wrapped)).text).toEqual("xxx ,:,: ....\\..., xxx");
        });
    });
});