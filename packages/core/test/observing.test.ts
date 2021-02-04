jest.autoMockOff();

import {waitFor} from '@testing-library/dom'
import '@testing-library/jest-dom/extend-expect';
import "regenerator-runtime/runtime.js";
import {Tolgee} from "../src";
import mockTranslations from "./mockTranslations";
import fetchMock from "jest-fetch-mock";

const API_URL = "http://localhost";
const API_KEY = "dummyApiKey";

const fetch = fetchMock.mockResponse(async req => {
    if (req.url === API_URL + "/uaa/scopes?ak=" + API_KEY) {
        return "[\"translations.edit\",\"translations.view\",\"keys.edit\"]";
    }

    if (req.url === API_URL + "/uaa/en?ak=" + API_KEY) {
        return JSON.stringify(mockTranslations);
    }

    throw new Error("Invalid request");
});

test('it translates some existing text', async () => {
    fetch.enableMocks();
    Error.stackTraceLimit = 50;

    document.body.innerHTML = "{{hello_world}}"

    const tolgee = new Tolgee({
        targetElement: document.body,
        apiKey: API_KEY,
        apiUrl: API_URL,
        inputPrefix: "{{",
        inputSuffix: "}}",
    });

    await tolgee.run().then();

    await waitFor(() => {
            return expect(fetch.mock.calls.length).toEqual(2);
        }
    );

    const el = document.evaluate("descendant-or-self::*[contains(text(), 'Hello world!')]", document.body, null, 0).iterateNext();
    expect(el).toBeInTheDocument();
})
