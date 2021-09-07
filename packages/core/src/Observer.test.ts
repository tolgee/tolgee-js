jest.dontMock('./Observer');
jest.dontMock('./services/DependencyStore');

import { DependencyStore } from './services/DependencyStore';
import '@testing-library/jest-dom/extend-expect';
import 'regenerator-runtime/runtime.js';
import { getMockedInstance } from '@testFixtures/mocked';
import { Properties } from './Properties';
import { CoreHandler } from './handlers/CoreHandler';
import { waitFor } from '@testing-library/dom';
import { TextHandler } from './handlers/TextHandler';
import { AttributeHandler } from './handlers/AttributeHandler';
import { Observer } from './Observer';
import { ElementRegistrar } from './services/ElementRegistrar';

describe('Observer', () => {
  let observer: Observer;
  let properties: Properties;

  beforeEach(async () => {
    observer = new DependencyStore().observer;
    properties = getMockedInstance(Properties);
    document.body = document.createElement('body');
    properties.config.targetElement = document.body;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Can be created', () => {
    expect(observer).toBeInstanceOf(Observer);
  });

  describe('Tests on document.body', () => {
    test('Will handle mutation on basic character data', async () => {
      const text = document.createTextNode('Dummy text node');
      document.body.append(text);
      observer.observe();
      text.textContent = 'Dummy text node modified';

      await waitFor(() => {
        const onNewNodesMock = getMockedInstance(TextHandler).handle;
        expect(onNewNodesMock).toBeCalledTimes(1);
        expect(onNewNodesMock).toBeCalledWith(text);
      });
    });

    test('Will handle mutation element child list', async () => {
      const text = document.createTextNode('Dummy text node');
      observer.observe();
      document.body.append(text);

      await waitFor(() => {
        const handleSubtree = getMockedInstance(CoreHandler).handleSubtree;

        expect(handleSubtree).toBeCalledTimes(1);
        expect(handleSubtree).toBeCalledWith(document.body);
      });
    });

    test('Will handle attribute mutation', async () => {
      const span = document.createElement('span');
      const attributeName = 'data-attribute';
      span.setAttribute(attributeName, 'text');
      document.body.append(span);
      observer.observe();
      span.setAttribute(attributeName, 'modified');

      await waitFor(() => {
        const handleAttributeMock = getMockedInstance(AttributeHandler).handle;
        expect(handleAttributeMock).toBeCalledTimes(1);
        expect(handleAttributeMock).toBeCalledWith(span);
      });
    });

    test('Will handle subtree mutation', async () => {
      const div = document.createElement('div');
      div.innerHTML = "<div><div></div><div id='innerDiv'></div></div>";
      document.body.append(div);
      const innerDiv = document.getElementById('innerDiv');
      observer.observe();
      innerDiv.textContent = 'This is inner text';

      await waitFor(() => {
        const handleAttributeMock =
          getMockedInstance(CoreHandler).handleSubtree;

        expect(handleAttributeMock).toBeCalledTimes(1);
        expect(handleAttributeMock).toBeCalledWith(innerDiv);
      });
    });

    test('will stop observing', async () => {
      observer.observe();
      observer.stopObserving();

      document.body.textContent = 'Nothing';
      await new Promise((resolve) => setTimeout(resolve, 10));

      const handleSubtree = getMockedInstance(CoreHandler).handleSubtree;
      expect(handleSubtree).not.toBeCalledTimes(1);
    });
  });

  test("Will call registrar's cleanInactive on change", async () => {
    const text = document.createTextNode('Dummy text node');
    document.body.append(text);
    observer.observe();
    text.textContent = 'Dummy text node modified';

    await waitFor(() => {
      const refreshAllMock = getMockedInstance(ElementRegistrar).refreshAll;
      expect(refreshAllMock).toBeCalledTimes(1);
    });
  });
});
