jest.autoMockOff();

import '@testing-library/jest-dom/extend-expect';
import UI from '../src';
import { NodeHelper } from '@tolgee/core/lib/helpers/NodeHelper';
import { TranslationService } from '@tolgee/core/lib/services/TranslationService';

test('it selects the key', (done) => {
  const ui = new UI({
    coreService: {} as any,
    properties: {} as any,
    translationService: {
      getFromCacheOrFallback: jest.fn(() => 'Translated key'),
    } as any as TranslationService,
    eventService: {} as any,
    apiHttpService: {} as any,
    mouseEventHandler: {} as any,
    textService: {} as any,
    textHandler: {} as any,
    highlightFunctionInitializer: {} as any,
    translationHighlighter: {} as any,
    elementRegistrar: {} as any,
    attributeHandler: {} as any,
    wrappedHandler: {} as any,
    coreHandler: {} as any,
    observer: {} as any,
    messages: {} as any,
    pluginManager: {} as any,
  });

  const mouseEvent = new MouseEvent('click');

  const keys = ['key 1', 'key 2'];

  ui.getKey({ openEvent: mouseEvent, keys: new Set(keys) }).then((key) => {
    expect(key).toEqual('key 2');
    done();
  });

  for (const key of keys) {
    const element = NodeHelper.evaluateToSingle(
      `//*[contains(text(), '${key}')]`,
      document.body
    );
    expect(element).toBeInTheDocument();
  }

  const translatedKeys = NodeHelper.evaluate(
    `//*[contains(text(), 'Translated key')]`,
    document.body
  );

  expect(translatedKeys).toHaveLength(2);

  const element = NodeHelper.evaluateToSingle(
    `//*[contains(text(), 'key 2')]`,
    document.body
  );
  element.parentElement.parentElement.click();
});
