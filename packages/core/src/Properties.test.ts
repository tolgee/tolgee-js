jest.dontMock("./Properties");

import '@testing-library/jest-dom/extend-expect';
import "regenerator-runtime/runtime.js";
import "reflect-metadata"
import {mocked} from 'ts-jest/utils';
import {Properties} from "./Properties";

describe("Properties", () => {
    let properties: Properties;

    beforeEach(() => {
        jest.clearAllMocks();
        properties = new Properties();
    });

    test("can be created", () => {
        expect(properties).not.toBeNull();
    });

    describe("preferred languages", () => {
        test("getter returns from local storage", () => {
            let dummyReturn = ["dummyLang1"];
            Storage.prototype.getItem = jest.fn();
            mocked(localStorage.getItem).mockReturnValueOnce(JSON.stringify(dummyReturn));
            expect(properties.preferredLanguages).toEqual(new Set(dummyReturn));
            expect(localStorage.getItem).toBeCalledWith("__tolgee_preferredLanguages");
        });

        test("setter sets local storage item", () => {
            let dummySet = ["dummyLang1"];
            Storage.prototype.setItem = jest.fn();
            properties.preferredLanguages = new Set(dummySet);
            expect(localStorage.setItem).toBeCalledWith("__tolgee_preferredLanguages", JSON.stringify(dummySet));
        })
    });

    describe("current language", () => {
        test("getter returns from local storage", () => {
            let dummyReturn = "cs";
            properties.config = {availableLanguages: ["cs", "en"]};
            Storage.prototype.getItem = jest.fn();
            mocked(localStorage.getItem).mockReturnValueOnce(dummyReturn);
            expect(properties.currentLanguage).toEqual(dummyReturn);
            expect(localStorage.getItem).toBeCalledWith("__tolgee_currentLanguage");
        });

        test("setter sets local storage item", () => {
            let dummySet = "dummyLang1";
            Storage.prototype.setItem = jest.fn();
            properties.currentLanguage = dummySet;
            expect(localStorage.setItem).toBeCalledWith("__tolgee_currentLanguage", dummySet);
        })

        test("returns correct lang by navigator", () => {
            const languageGetter = jest.spyOn(window.navigator, 'language', 'get')
            languageGetter.mockReturnValue("cs")
            properties.config = {availableLanguages: ["en", "cs"]}
            expect(properties.currentLanguage).toEqual("cs");
        })

        test("returns default lang if not available", () => {
            const languageGetter = jest.spyOn(window.navigator, 'language', 'get')
            languageGetter.mockReturnValue("cs")
            properties.config = {availableLanguages: ["en"], defaultLanguage: "en"}
            expect(properties.currentLanguage).toEqual("en");
        })

        test("returns correct language ignoring dialect", () => {
            const languageGetter = jest.spyOn(window.navigator, 'language', 'get')
            languageGetter.mockReturnValue("en-GB")
            properties.config = {availableLanguages: ["en-US"], defaultLanguage: "en-US"}
            expect(properties.currentLanguage).toEqual("en-US");
        })

        test("resets current language when missing in availableLanguages", () => {
            let dummyReturn = "cs";
            Storage.prototype.getItem = jest.fn();
            mocked(localStorage.getItem).mockReturnValueOnce(dummyReturn);
            properties.config = {availableLanguages: ["en", "de"], defaultLanguage: "en"}
            expect(properties.currentLanguage).toEqual("en");
        })
    });
});