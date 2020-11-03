jest.dontMock("./Polygloat");

import '@testing-library/jest-dom/extend-expect';
import "regenerator-runtime/runtime.js";
import "reflect-metadata"
import {mocked} from 'ts-jest/utils'
import {CoreService} from "./services/CoreService";
import Polygloat from "./Polygloat";
import {
    configMock,
    coreServiceMock,
    eventEmitterMock,
    eventServiceMock,
    getMockedInstance,
    observerMock,
    propertiesMock,
    textServiceMock,
    translationServiceMock
} from "../__testFixtures/mocked";
import {EventEmitter} from "./services/EventEmitter";
import {Scope} from "./types";
import {TextService} from "./services/TextService";
import {CoreHandler} from "./handlers/CoreHandler";

describe("Polygloat", () => {
    let polygloat: Polygloat;

    beforeEach(() => {
        jest.clearAllMocks();
        polygloat = new Polygloat({});
    });

    test("can be created", () => {
        expect(polygloat).not.toBeNull();
    });

    test("returns proper default language", () => {
        configMock.mock.instances[0].defaultLanguage = "testDefaultLanguage"
        expect(configMock).toBeCalledTimes(1);
        expect(polygloat.defaultLanguage).toEqual("testDefaultLanguage");
    });

    test("returns proper language", () => {
        propertiesMock.mock.instances[0].currentLanguage = "currentLang"
        expect(polygloat.lang).toEqual("currentLang");
    });

    test("returns instance of polygloat service", () => {
        expect(polygloat.coreService instanceof CoreService).toBeTruthy();
    });

    test("will set properties.scopes on run in development mode", async () => {
        propertiesMock.mock.instances[0].config.mode = "development";
        await polygloat.run();
        expect(coreServiceMock.mock.instances[0].getScopes).toBeCalledTimes(1);
        expect(propertiesMock.mock.instances[0].scopes).toContain("translations.edit" as Scope);
        expect(propertiesMock.mock.instances[0].scopes).not.toContain("translations.view" as Scope);
    });

    test("will not set properties.scopes on run in production mode", async () => {
        propertiesMock.mock.instances[0].config.mode = "production";
        await polygloat.run();
        expect(coreServiceMock.mock.instances[0].getScopes).toBeCalledTimes(0);
        expect(propertiesMock.mock.instances[0].scopes).toBeUndefined();
    });


    test("will run the observer when watch is on", async () => {
        propertiesMock.mock.instances[0].config.watch = true;
        await polygloat.run();
        expect(observerMock.mock.instances[0].observe).toBeCalledTimes(1)
    });


    test("will not the observer when watch is off", async () => {
        propertiesMock.mock.instances[0].config.watch = false;
        await polygloat.run();
        expect(observerMock.mock.instances[0].observe).toBeCalledTimes(0)
    });


    test("will try to get translations with current language from properties", async () => {
        propertiesMock.mock.instances[0].currentLanguage = "dummyLang"
        await polygloat.run();
        expect(translationServiceMock.mock.instances[0].loadTranslations).toBeCalledWith()
    });

    test("will refresh translations using observer on run", async () => {
        let htmlElement = document.createElement("dummyElement");
        propertiesMock.mock.instances[0].config.targetElement = htmlElement;
        await polygloat.run();
        expect(getMockedInstance(CoreHandler).handleSubtree).toBeCalledWith(htmlElement)
    });


    test("will refresh translations using observer on refresh", async () => {
        let htmlElement = document.createElement("dummyElement");
        propertiesMock.mock.instances[0].config.targetElement = htmlElement;
        await polygloat.refresh();
        expect(getMockedInstance(CoreHandler).handleSubtree).toBeCalledWith(htmlElement)
    });


    test("will get defaultLanguage from config", async () => {
        propertiesMock.mock.instances[0].config.defaultLanguage = "dummyLang"
        expect(polygloat.defaultLanguage).toEqual("dummyLang");
    });

    describe("translation functions", () => {
        const translatedDummyText = "translatedDummyText";
        const wrappedDummyText = "wrappedDummyText";
        const dummyKey = "dummyText";
        let mockedTranslate;
        let mockedInstant;
        let mockedWrap;
        const dummyParams = {};

        beforeEach(() => {
            mockedTranslate = mocked(textServiceMock.mock.instances[0].translate);
            mockedInstant = mocked(textServiceMock.mock.instances[0].instant);
            mockedWrap = mocked(textServiceMock.mock.instances[0].wrap);
            mockedTranslate.mockImplementation(async () => translatedDummyText);
            mockedInstant.mockImplementation(() => translatedDummyText);
            mockedWrap.mockImplementation(() => wrappedDummyText);
        });

        describe("async translate", () => {
            test("will return wrapped string from text service in development mode", async () => {
                propertiesMock.mock.instances[0].config.mode = "development";
                const translated = await polygloat.translate(dummyKey, dummyParams);

                expect(mockedWrap).toBeCalledWith(dummyKey, dummyParams)
                expect(mockedTranslate).not.toBeCalled();
                expect(translated).toEqual(wrappedDummyText);
            });


            test("will return translated string from text service in production mode", async () => {
                propertiesMock.mock.instances[0].config.mode = "production";
                const translated = await polygloat.translate(dummyKey, dummyParams);

                expect(translated).toEqual(translatedDummyText);
                expect(mockedWrap).not.toBeCalled();
                expect(mockedTranslate).toBeCalledWith(dummyKey, dummyParams);
            });

            test("will not wrap when development is on, but noWrap is true", async () => {
                propertiesMock.mock.instances[0].config.mode = "development";
                const translated = await polygloat.translate(dummyKey, dummyParams, true);

                expect(mockedWrap).not.toBeCalled()
                expect(translated).toEqual(translatedDummyText);
            });
        });

        describe("sync instant", () => {
            test("will return wrapped string from text service in development mode", async () => {
                propertiesMock.mock.instances[0].config.mode = "development";
                const dummyParams = {};
                const translated = polygloat.instant(dummyKey, dummyParams);

                expect(mockedWrap).toBeCalledWith(dummyKey, dummyParams)
                expect(mockedInstant).not.toBeCalled();
                expect(translated).toEqual(wrappedDummyText);
            });


            test("will return translated string from text service in production mode", async () => {
                propertiesMock.mock.instances[0].config.mode = "production";
                const translated = polygloat.instant(dummyKey, dummyParams);

                expect(translated).toEqual(translatedDummyText);
                expect(mockedWrap).not.toBeCalled();
                expect(mockedInstant).toBeCalledWith(dummyKey, dummyParams, undefined, undefined);
            });

            test("will pass noEmpty parameter", () => {
                polygloat.instant(dummyKey, dummyParams, undefined, true);
                expect(mockedInstant).toBeCalledWith(dummyKey, dummyParams, undefined, true);
            });

            test("will not wrap when development is on, but noWrap is true", async () => {
                propertiesMock.mock.instances[0].config.mode = "development";
                const translated = polygloat.instant(dummyKey, dummyParams, true);

                expect(mockedWrap).not.toBeCalled()
                expect(translated).toEqual(translatedDummyText);
            });

            test("will call instant with orEmpty true", async () => {
                polygloat.instant(dummyKey, dummyParams, true, true);
                expect(getMockedInstance(TextService).instant).toBeCalledWith(dummyKey, dummyParams, undefined, true);
            });
        });
    });

    test("will stop on stop function", () => {
        polygloat.run();
        polygloat.stop();
        expect(observerMock.mock.instances[0].stopObserving).toBeCalledTimes(1);
    });

    test("will return proper onLangChange emitter", () => {
        let eventEmitter = new EventEmitter();
        (eventServiceMock.mock.instances[0] as any).LANGUAGE_CHANGED = eventEmitter;
        expect(polygloat.onLangChange).toEqual(eventEmitter);
    });

    describe("lang setter", () => {
        const dummyLang = "dummyLang";

        beforeEach(() => {
            (eventServiceMock.mock.instances[0] as any).LANGUAGE_CHANGED = new EventEmitter();
            polygloat.lang = dummyLang;
        })

        test("will change the language", () => {
            expect(propertiesMock.mock.instances[0].currentLanguage).toEqual(dummyLang);
        })

        test("will change the language", () => {
            expect(eventEmitterMock.mock.instances[0].emit).toBeCalledTimes(1);
        })
    });
});