jest.dontMock('./MouseEventHandler');
jest.dontMock('../Constants/ModifierKey');
jest.dontMock('../services/EventEmitter');
jest.dontMock('../services/Subscription');
jest.dontMock('../services/DependencyStore');

import { MouseEventHandler } from './MouseEventHandler';
import { ElementMeta, ElementWithMeta } from '../types';
import { getMockedInstance } from '@testFixtures/mocked';
import { Properties } from '../Properties';
import { ModifierKey } from '../Constants/ModifierKey';
import { DependencyStore } from '../services/DependencyStore';

describe('MouseEventHandler', () => {
  let mouseEventHandler: MouseEventHandler;
  let mockedElement: ElementWithMeta;
  const key = 'Alt';

  const mockedCallback = jest.fn();
  const mockedClick = new MouseEvent('click');
  const mockedMouseOver = new MouseEvent('mouseover');
  const mockedMouseOut = new MouseEvent('mouseout');
  const mockedKeydown = new KeyboardEvent('keydown', { key });
  const mockedKeyup = new KeyboardEvent('keyup', { key });
  let mockedHighlight = jest.fn();
  const mockedUnhighlight = jest.fn();

  const withMeta = (element: Element) => {
    (element as ElementWithMeta)._tolgee = {
      highlight: mockedHighlight,
      unhighlight: mockedUnhighlight,
    } as any as ElementMeta;
    return element as Element as ElementWithMeta;
  };

  beforeEach(async () => {
    mouseEventHandler = new DependencyStore().mouseEventHandler;
    mockedElement = withMeta(document.createElement('div'));
    mouseEventHandler.handle(mockedElement, mockedCallback);
    getMockedInstance(Properties).config.highlightKeys = [ModifierKey[key]];
    mockedElement.dispatchEvent(mockedMouseOver);
    window.dispatchEvent(mockedKeydown);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  describe('highlighting', () => {
    test('Will highlight', async () => {
      expect(mockedHighlight).toBeCalledTimes(1);
    });

    test('Will unhighlight', async () => {
      mockedElement.dispatchEvent(mockedMouseOut);
      expect(mockedUnhighlight).toBeCalled();
    });

    test('Will not highlight just on mouseover', async () => {
      mockedElement.dispatchEvent(mockedMouseOut);
      window.dispatchEvent(mockedKeyup);
      mockedHighlight = jest.fn();
      mockedElement.dispatchEvent(mockedMouseOver);
      expect(mockedHighlight).toBeCalledTimes(0);
    });

    test('Will prevent clean on mouseover', async () => {
      mockedElement.dispatchEvent(mockedMouseOut);
      window.dispatchEvent(mockedKeyup);
      mockedHighlight = jest.fn();
      mockedElement.dispatchEvent(mockedMouseOver);
      expect(mockedElement._tolgee.preventClean).toBeTruthy();
    });

    test('Will remove prevent clean on mouseout', async () => {
      mockedElement.dispatchEvent(mockedMouseOut);
      window.dispatchEvent(mockedKeyup);
      mockedElement._tolgee.preventClean = true;
      mockedElement.dispatchEvent(mockedMouseOut);
      expect(mockedElement._tolgee.preventClean).toBeFalsy();
    });

    test('Will not highlight just on keydown', async () => {
      window.dispatchEvent(mockedKeyup);
      mockedElement.dispatchEvent(mockedMouseOut);
      mockedHighlight = jest.fn();
      window.dispatchEvent(mockedKeydown);
      expect(mockedHighlight).toBeCalledTimes(0);
    });

    test('Will highlight when keydown first', async () => {
      window.dispatchEvent(mockedKeyup);
      mockedElement.dispatchEvent(mockedMouseOut);
      window.dispatchEvent(mockedKeydown);
      mockedElement.dispatchEvent(mockedMouseOver);
      expect(mockedHighlight).toBeCalled();
    });

    test('Will not handle single element multiple times', async () => {
      // eslint-disable-next-line no-console
      console.error = jest.fn();
      mouseEventHandler.handle(mockedElement, () => {});
      mouseEventHandler.handle(mockedElement, () => {});

      // eslint-disable-next-line no-console
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
      mockedHighlight.mockClear();
      elementToHighlight.dispatchEvent(mockedMouseOver);
      expect(mockedHighlight).toBeCalledTimes(1);
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
