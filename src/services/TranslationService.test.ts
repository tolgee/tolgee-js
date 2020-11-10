jest.dontMock("./TranslationService");
jest.dontMock("../helpers/TextHelper");
jest.dontMock("../DTOs/TranslationData");
jest.dontMock("../Errors/ApiHttpError");

import describeClassFromContainer from "@testFixtures/describeClassFromContainer";
import {getMockedInstance} from "@testFixtures/mocked";
import {TranslationService} from "./TranslationService";
import {ApiHttpService} from "./ApiHttpService";
import {Properties} from "../Properties";
import {CoreService} from "./CoreService";
import {TranslationData} from "../DTOs/TranslationData";
import {ApiHttpError} from "../Errors/ApiHttpError";

const mockedTranslations = {
    en: {
        key: "translated",
        "translation.with.dots": "Translation with dots",
        structured: {
            subtree: {
                translation: "Structured subtree translation"
            }
        },
        "key with: \\\\": {
            t: "Key with strange escapes"
        }
    },
    de: {
        key: "übersetzen"
    }
};

global.fetch = jest.fn(async () => {
    return {
        json: jest.fn(async () => (mockedTranslations.en))
    }
}) as any;


describe("TranslationService", () => {
    const getTranslationService = describeClassFromContainer(import("./TranslationService"), "TranslationService");
    let translationService: ReturnType<typeof getTranslationService>;

    beforeEach(async () => {
        translationService = await getTranslationService();
        getMockedInstance(ApiHttpService).fetchJson = jest.fn(async () => mockedTranslations);
    });


    describe("(translation loading and retrieval)", () => {
        test("will load translations in production mode", async () => {
            await translationService.loadTranslations("en");
            expect(translationService.getFromCacheOrFallback("key", "en")).toEqual("translated");
        });

        test("will load translations in development mode", async () => {
            getMockedInstance(Properties).config.mode = "development";
            await translationService.loadTranslations("en");
            expect(translationService.getFromCacheOrFallback("key", "en")).toEqual("translated");
        });
        test("will try to load the languages only single time", async () => {
            await translationService.loadTranslations("en");
            await translationService.loadTranslations("en");
            expect(fetch).toBeCalledTimes(1);
        });

        test("will get proper translation", async () => {
            expect(await translationService.getTranslation("key", "en")).toEqual("translated");
        });

        test("will get proper translation containing .", async () => {
            expect(await translationService.getTranslation("translation\\.with\\.dots")).toEqual("Translation with dots");
        });

        test("will get proper structured subtree translation", async () => {
            expect(await translationService.getTranslation("structured.subtree.translation")).toEqual("Structured subtree translation");
        })

        test("will get proper translation on strange key", async () => {
            expect(await translationService.getTranslation("key with: \\\\\\\\.t")).toEqual("Key with strange escapes");
        })

        test("will get proper translation from cache", async () => {
            expect(await translationService.getTranslation("key with: \\\\\\\\.t")).toEqual("Key with strange escapes");
        })

        test("will return fallback lang translation", async () => {
            expect(await translationService.getTranslation("key", "cz")).toEqual("translated");
        });

        test("will get translations of key", async () => {
            getMockedInstance(ApiHttpService).postJson = jest.fn(async () => ({en: "translated", de: "übersetzen"}));
            const translationData = await translationService.getTranslationsOfKey("key", new Set<string>(["en", "de"]));
            expect(translationData).toEqual({key: "key", translations: {en: "translated", de: "übersetzen"}});
        });

        test("will reset prefered languages when language is not found", async () => {
            global["apierror"] = ApiHttpError;
            getMockedInstance(ApiHttpService).postJson = jest.fn(async () => {
                throw new ApiHttpError({status: 404} as Response, "language_not_found")
            });

            delete global.location;
            global.location = {reload: jest.fn()} as any;
            global.console.error = jest.fn();
            getMockedInstance(CoreService).getLanguages = jest.fn(async () => new Set(["dummyLang"]));
            await translationService.getTranslationsOfKey("aaa", new Set<string>());
            expect(getMockedInstance(Properties).preferredLanguages).toEqual(new Set(["dummyLang"]));
            expect(console.error).toBeCalledTimes(1);
            expect(location.reload).toBeCalledTimes(1);

        });
    })


    describe("set translation", () => {
        const dummyTranslationData = {key: "test key", translations: {en: "translation"}} as TranslationData;

        beforeEach(async () => {
            await translationService.setTranslations(dummyTranslationData);
        });

        test("will call the api http service", async () => {
            expect(getMockedInstance(ApiHttpService).post).toBeCalledTimes(1);
            expect(getMockedInstance(ApiHttpService).post).toBeCalledWith("", dummyTranslationData);
        })

        test("will check the scopes", async () => {
            expect(getMockedInstance(CoreService).checkScope).toBeCalledTimes(1);
        })

        test("will update the data", async () => {
            await translationService.loadTranslations("en");
            await translationService.setTranslations(dummyTranslationData);
            expect(await translationService.getTranslation(dummyTranslationData.key, "en")).toEqual(dummyTranslationData.translations.en);
        })
    })

    test("will update the data when the key contains .", async () => {
        const dummyTranslationData = {key: "test.key", translations: {en: "translation"}} as TranslationData;
        await translationService.loadTranslations("en");
        await translationService.setTranslations(dummyTranslationData);
        expect(await translationService.getTranslation(dummyTranslationData.key, "en")).toEqual(dummyTranslationData.translations.en);
    });

    test("will update the data when the key contains \\.", async () => {
        const dummyTranslationData = {key: "test\\.key", translations: {en: "translation"}} as TranslationData;
        await translationService.loadTranslations("en");
        await translationService.setTranslations(dummyTranslationData);
        expect(await translationService.getTranslation(dummyTranslationData.key, "en")).toEqual(dummyTranslationData.translations.en);
    });


    test("will use fallback language on error", async () => {
        const dummyTranslationData = {key: "test\\.key", translations: {en: "translation"}} as TranslationData;
        await translationService.loadTranslations("en");
        await translationService.setTranslations(dummyTranslationData);
        expect(await translationService.getTranslation(dummyTranslationData.key, "en")).toEqual(dummyTranslationData.translations.en);
    });

    test("will return last chunk of key path when no translation found", async () => {
        expect(await translationService.getTranslation("test\\.key.this\\.is\\.it", "en")).toEqual("this.is.it");
    });

    test("will return proper text without any dot", async () => {
        expect(await translationService.getTranslation("text without any dot", "en")).toEqual("text without any dot");
    });

});