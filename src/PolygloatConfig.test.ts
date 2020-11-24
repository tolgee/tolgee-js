jest.dontMock("./PolygloatConfig");

import {PolygloatConfig} from "./PolygloatConfig";

describe("PolygloatConfig", () => {
    test("will be created with default targetElement", () => {
        const polygloatConfig = new PolygloatConfig();
        expect(polygloatConfig.targetElement).toEqual(document.body);
    })

    test("will be created with provided targetElement", () => {
        const div = document.createElement("div");
        const polygloatConfig = new PolygloatConfig({targetElement: div});
        expect(polygloatConfig.targetElement).toEqual(div);
    })

    test("will be created with default when empty object", () => {
        const polygloatConfig = new PolygloatConfig({});
        expect(polygloatConfig.targetElement).toEqual(document.body);
    })

});