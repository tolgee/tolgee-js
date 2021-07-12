jest.dontMock('./MouseEventHandler');
jest.dontMock('../Constants/ModifierKey');
jest.dontMock('../services/EventEmitter');
jest.dontMock('../services/Subscription');

import { ElementMeta, ElementWithMeta } from '../types';
import describeClassFromContainer from '@testFixtures/describeClassFromContainer';
import { MouseEventHandler } from './MouseEventHandler';
import { getMockedInstance } from '@testFixtures/mocked';
import { Properties } from '../Properties';
import { ModifierKey } from '../Constants/ModifierKey';

describe('MouseEventHandler', () => {
  const getMouseEventHandler = describeClassFromContainer(
    import('./MouseEventHandler'),
    'MouseEventHandler'
  );
  let mouseEventHandler: ReturnType<typeof getMouseEventHandler>;
  let mockedElement: ElementWithMeta;
  const key = 'Alt';
  const mockedColor = 'rgb(0, 30, 50)';

  const mockedCallback = jest.fn();
  const mockedClick = new MouseEvent('click');
  const mockedMouseOver = new MouseEvent('mouseover');
  const mockedMouseOut = new MouseEvent('mouseout');
  const mockedKeydown = new KeyboardEvent('keydown', { key });
  const mockedKeyup = new KeyboardEvent('keyup', { key });

  const withMeta = (element: Element) => {
    (element as ElementWithMeta)._tolgee = {} as ElementMeta;
    return element as Element as ElementWithMeta;
  };

  beforeEach(async () => {
    mouseEventHandler = await getMouseEventHandler();
    mockedElement = withMeta(document.createElement('div'));
    mouseEventHandler.handle(mockedElement, mockedCallback);
    getMockedInstance(Properties).config.highlightKeys = [ModifierKey[key]];
    getMockedInstance(Properties).config.highlightColor = mockedColor;
    mockedElement.dispatchEvent(mockedMouseOver);
    window.dispatchEvent(mockedKeydown);
  });

  describe('highlighting', () => {
    test('Will highlight', async () => {
      expect(mockedElement.style.backgroundColor).toEqual(mockedColor);
    });

    test('Will unhighlight', async () => {
      mockedElement.dispatchEvent(mockedMouseOut);
      expect(mockedElement.style.backgroundColor).toEqual('');
    });

    test('Will reset to correct initial color', async () => {
      mockedElement.dispatchEvent(mockedMouseOut);
      mockedElement.style.backgroundColor = '#222222';
      mockedElement.dispatchEvent(mockedMouseOver);
      mockedElement.dispatchEvent(mockedMouseOut);
      expect(mockedElement.style.backgroundColor).toEqual('rgb(34, 34, 34)');
    });

    test('Will not highlight just on mouseover', async () => {
      mockedElement.dispatchEvent(mockedMouseOut);
      window.dispatchEvent(mockedKeyup);
      mockedElement.dispatchEvent(mockedMouseOver);
      expect(mockedElement.style.backgroundColor).toEqual('');
    });

    test('Will not highlight just on keydown', async () => {
      window.dispatchEvent(mockedKeyup);
      mockedElement.dispatchEvent(mockedMouseOut);
      window.dispatchEvent(mockedKeydown);
      expect(mockedElement.style.backgroundColor).toEqual('');
    });

    test('Will highlight when keydown first', async () => {
      window.dispatchEvent(mockedKeyup);
      mockedElement.dispatchEvent(mockedMouseOut);
      window.dispatchEvent(mockedKeydown);
      mockedElement.dispatchEvent(mockedMouseOver);
      expect(mockedElement.style.backgroundColor).toEqual(mockedColor);
    });

    test('Will not handle single element multiple times', async () => {
      console.error = jest.fn();
      mouseEventHandler.handle(mockedElement, () => {});
      mouseEventHandler.handle(mockedElement, () => {});

      expect(console.error).toBeCalledTimes(2);
      mockedElement.dispatchEvent(mockedClick);
      expect(mockedCallback).toBeCalledTimes(1);
    });

    test('Will clear keys on window blur', async () => {
      window.dispatchEvent(new Event('blur'));
      mockedElement.dispatchEvent(mockedClick);
      expect(mockedCallback).not.toBeCalledTimes(1);
    });

    test('Will highlight even if some element was removed', async () => {
      const div = document.createElement('div');
      div.append(mockedElement);
      const elementToHighlight = withMeta(document.createElement('div'));
      div.append(elementToHighlight);
      mouseEventHandler.handle(
        elementToHighlight as any as ElementWithMeta,
        mockedCallback
      );
      mockedElement.dispatchEvent(mockedMouseOver);
      div.removeChild(mockedElement);
      window.dispatchEvent(mockedKeydown);
      elementToHighlight.dispatchEvent(mockedMouseOver);
      expect(elementToHighlight.style.backgroundColor).toEqual(mockedColor);
    });
  });

  describe('click', () => {
    test('Will call callback on click', async () => {
      mockedElement.dispatchEvent(mockedClick);
      expect(mockedCallback).toBeCalledTimes(1);
    });
  });

  describe('Remove all listeners callback', () => {
    test('will be assigned on init', () => {
      expect(typeof mockedElement._tolgee.removeAllEventListeners).toEqual(
        'function'
      );
    });

    test("will not handle click after it's call", () => {
      mockedElement._tolgee.removeAllEventListeners();
      mockedElement.dispatchEvent(mockedClick);
      expect(mockedCallback).toBeCalledTimes(0);
    });

    test("will not handle mouse over after it's call", () => {
      mockedElement._tolgee.removeAllEventListeners();
      mockedElement.dispatchEvent(mockedMouseOver);
      expect(mockedCallback).toBeCalledTimes(0);
    });

    test("will not handle mouse leave after it's call", () => {
      mockedElement._tolgee.removeAllEventListeners();
      mockedElement.dispatchEvent(mockedMouseOut);
      expect(mockedCallback).toBeCalledTimes(0);
    });
  });
});
