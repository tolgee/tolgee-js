jest.dontMock('./MouseEventHandler');
jest.dontMock('../Constants/ModifierKey');
jest.dontMock('../services/EventEmitter');
jest.dontMock('../services/Subscription');
jest.dontMock('../services/DependencyService');

import { ElementMeta, ElementWithMeta } from '../types';
import { getMockedInstance } from '@testFixtures/mocked';
import { Properties } from '../Properties';
import { ModifierKey } from '../Constants/ModifierKey';
import { DependencyService } from '../services/DependencyService';

describe('MouseEventHandler', () => {
  let mockedElement: ElementWithMeta;
  const key = 'Alt';

  const mockedCallback = jest.fn();
  const mockedClick = new MouseEvent('click');
  const mockedMouseMove = new MouseEvent('mousemove', {
    clientX: 15,
    clientY: 15,
  });
  const mockedKeydown = new KeyboardEvent('keydown', { key });
  const mockedKeyup = new KeyboardEvent('keyup', { key });
  const mockedHighlight = jest.fn();
  const mockedUnhighlight = jest.fn();

  const withMeta = (element: Element) => {
    (element as ElementWithMeta)._tolgee = {
      highlight: mockedHighlight,
      unhighlight: mockedUnhighlight,
    } as any as ElementMeta;
    return element as Element as ElementWithMeta;
  };

  const moveMouseAway = () => {
    document.elementFromPoint = jest.fn(() => undefined);
    mockedElement.dispatchEvent(mockedMouseMove);
  };

  const moveMouseOn = () => {
    document.elementFromPoint = jest.fn(() => mockedElement);
    mockedElement.dispatchEvent(mockedMouseMove);
  };

  let dependencyService: DependencyService;

  beforeEach(async () => {
    dependencyService = new DependencyService();
    dependencyService.translationHighlighter.translationEdit = mockedCallback;
    dependencyService.init({});
    dependencyService.run();
    mockedElement = withMeta(document.createElement('div'));
    mockedElement.style.width = '20px';
    mockedElement.style.height = '20px';
    document.body.appendChild(mockedElement);
    getMockedInstance(Properties).config.highlightKeys = [ModifierKey[key]];
    mockedElement.dispatchEvent(mockedKeydown);
    moveMouseOn();
  });

  afterEach(async () => {
    dependencyService.mouseEventHandler.stop();
    jest.clearAllMocks();
  });

  describe('highlighting', () => {
    test('Will highlight', async () => {
      expect(mockedHighlight).toBeCalledTimes(1);
    });

    test('Will unhighlight', async () => {
      moveMouseAway();
      expect(mockedUnhighlight).toBeCalled();
    });

    test('Will not highlight just on mouseover', async () => {
      moveMouseAway();
      document.dispatchEvent(mockedKeyup);
      mockedHighlight.mockClear();
      moveMouseOn();
      expect(mockedHighlight).toBeCalledTimes(0);
    });

    test('Will prevent clean on mouseover', async () => {
      expect(mockedElement._tolgee.preventClean).toBeTruthy();
      moveMouseAway();
      expect(mockedElement._tolgee.preventClean).toBeFalsy();
    });

    test('Will remove prevent clean on mouseout', async () => {
      moveMouseAway();
      expect(mockedElement._tolgee.preventClean).toBeFalsy();
    });

    test('Will not highlight just on keydown', async () => {
      mockedHighlight.mockClear();
      moveMouseAway();
      mockedElement.dispatchEvent(mockedKeyup);
      mockedElement.dispatchEvent(mockedKeydown);
      expect(mockedHighlight).toBeCalledTimes(0);
    });

    test('Will highlight when keydown first', async () => {
      mockedHighlight.mockClear();
      moveMouseAway();
      mockedElement.dispatchEvent(mockedKeyup);
      document.dispatchEvent(mockedKeydown);
      moveMouseOn();
      expect(mockedHighlight).toBeCalledTimes(1);
    });

    test('Will clear keys on window blur', async () => {
      document.dispatchEvent(new Event('blur'));
      mockedElement.dispatchEvent(mockedClick);
      expect(mockedCallback).not.toBeCalledTimes(1);
    });
  });

  describe('click', () => {
    test('Will call callback on click', async () => {
      mockedElement.dispatchEvent(mockedClick);
      expect(mockedCallback).toBeCalledTimes(1);
    });
  });

  describe('eventHandler stopping', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    test("will not handle click after it's call", () => {
      dependencyService.mouseEventHandler.stop();
      mockedElement.dispatchEvent(mockedClick);
      expect(mockedCallback).toBeCalledTimes(0);
    });

    test("will not handle mouse over after it's call", () => {
      moveMouseAway();
      dependencyService.mouseEventHandler.stop();
      moveMouseOn();
      expect(mockedHighlight).toBeCalledTimes(0);
    });

    test("will not handle mouse leave after it's call", () => {
      dependencyService.mouseEventHandler.stop();
      moveMouseAway();
      expect(mockedCallback).toBeCalledTimes(0);
    });
  });
});
