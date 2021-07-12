jest.dontMock('./Observer');

import describeClassFromContainer from '@testFixtures/describeClassFromContainer';
import '@testing-library/jest-dom/extend-expect';
import 'regenerator-runtime/runtime.js';
import 'reflect-metadata';
import { getMockedInstance } from '@testFixtures/mocked';
import { Properties } from './Properties';
import { CoreHandler } from './handlers/CoreHandler';
import { waitFor } from '@testing-library/dom';
import { TextHandler } from './handlers/TextHandler';
import { AttributeHandler } from './handlers/AttributeHandler';
import { Observer } from './Observer';
import { ElementRegistrar } from './services/ElementRegistrar';

describe('Observer', () => {
  const getObserver = describeClassFromContainer(
    import('./Observer'),
    'Observer'
  );
  let observer: Observer;

  beforeEach(async () => {
    observer = await getObserver();
    document.body = document.createElement('body');
  });

  beforeEach(() => {
    getMockedInstance(Properties).config.targetElement = document.body;
  });

  test('Can be created', () => {
    expect(observer).toBeInstanceOf(Observer);
  });

  describe('Tests on document.body', () => {
    test('Will handle mutation on basic character data', async () => {
      let text = document.createTextNode('Dummy text node');
      document.body.append(text);
      observer.observe();
      text.textContent = 'Dummy text node modified';

      await waitFor(() => {
        let onNewNodesMock = getMockedInstance(TextHandler).handle;

        expect(onNewNodesMock).toBeCalledTimes(1);
        expect(onNewNodesMock).toBeCalledWith(text);
      });
    });

    test('Will handle mutation element child list', async () => {
      let text = document.createTextNode('Dummy text node');
      observer.observe();
      document.body.append(text);

      await waitFor(() => {
        let handleSubtree = getMockedInstance(CoreHandler).handleSubtree;

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
        let handleAttributeMock = getMockedInstance(AttributeHandler).handle;

        expect(handleAttributeMock).toBeCalledTimes(1);
        expect(handleAttributeMock).toBeCalledWith(span);
      });
    });

    test('Will handle subtree mutation', async () => {
      const div = document.createElement('div');
      div.innerHTML = "<div><div></div><div id='innerDiv'></div></div>";
      document.body.append(div);
      let innerDiv = document.getElementById('innerDiv');
      observer.observe();
      innerDiv.textContent = 'This is inner text';

      await waitFor(() => {
        let handleAttributeMock = getMockedInstance(CoreHandler).handleSubtree;

        expect(handleAttributeMock).toBeCalledTimes(1);
        expect(handleAttributeMock).toBeCalledWith(innerDiv);
      });
    });

    test('will stop observing', async () => {
      observer.observe();
      observer.stopObserving();

      document.body.textContent = 'Nothing';
      await new Promise((resolve) => setTimeout(resolve, 10));

      let handleSubtree = getMockedInstance(CoreHandler).handleSubtree;
      expect(handleSubtree).not.toBeCalledTimes(1);
    });
  });

  test("Will call registrar's cleanInactive on change", async () => {
    let text = document.createTextNode('Dummy text node');
    document.body.append(text);
    observer.observe();
    text.textContent = 'Dummy text node modified';

    await waitFor(() => {
      let refreshAllMock = getMockedInstance(ElementRegistrar).refreshAll;
      expect(refreshAllMock).toBeCalledTimes(1);
    });
  });
});
