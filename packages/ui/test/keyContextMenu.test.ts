jest.autoMockOff();

import '@testing-library/jest-dom/extend-expect'
import UI from "../src";
import {NodeHelper} from "@polygloat/core/lib/helpers/NodeHelper"
import {TranslationService} from "@polygloat/core/lib/services/TranslationService";


test('it selects the key', async (done) => {
    const ui = new UI({
        coreService: {} as any,
        properties: {} as any,
        translationService: {
            getFromCacheOrFallback: jest.fn(() => "Translated key")
        } as any as TranslationService,
        eventService: {} as any
    });

    const mouseEvent = new MouseEvent("click");

    const keys = ["key 1", "key 2"];

    ui.getKey({openEvent: mouseEvent, keys: new Set(keys)}).then(key => {
        expect(key).toEqual("key 2");
        done();
    });

    for (const key of keys) {
        const element = NodeHelper.evaluateToSingle(`//*[contains(text(), '${key}')]`, document.body);
        expect(element).toBeInTheDocument();
    }

    const translatedKeys = NodeHelper.evaluate(`//*[contains(text(), 'Translated key')]`, document.body);

    expect(translatedKeys).toHaveLength(2);

    const element = NodeHelper.evaluateToSingle(`//*[contains(text(), 'key 2')]`, document.body);
    element.parentElement.parentElement.click();
});