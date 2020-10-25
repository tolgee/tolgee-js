import '@testing-library/jest-dom/extend-expect';
import "regenerator-runtime/runtime.js";
import "reflect-metadata"
jest.mock("./toolsManager/PluginManager");
jest.dontMock("./Properties");

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
            expect(localStorage.getItem).toBeCalledWith("__polygloat_preferredLanguages");
        });

        test("setter sets local storage item", () => {
            let dummySet = ["dummyLang1"];
            Storage.prototype.setItem = jest.fn();
            properties.preferredLanguages = new Set(dummySet);
            expect(localStorage.setItem).toBeCalledWith("__polygloat_preferredLanguages", JSON.stringify(dummySet));
        })
    });
});