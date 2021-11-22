jest.dontMock('./TranslationHighlighter');
jest.dontMock('../services/DependencyStore');

import { TranslationHighlighter } from './TranslationHighlighter';
import classMock from '@testFixtures/classMock';
import { MouseEventHandler } from './MouseEventHandler';
import { getMockedInstance } from '@testFixtures/mocked';
import { ElementWithMeta } from '../types';
import { Properties } from '../Properties';
import { createElement } from '@testFixtures/createElement';
import { DependencyStore } from '../services/DependencyStore';

describe('TranslationHighlighter', () => {
  let translationHighlighter: TranslationHighlighter;

  beforeEach(async () => {
    translationHighlighter = new DependencyStore().translationHighlighter;
  });

  afterEach(async () => {
    jest.clearAllMocks();
    window['@tolgee/ui'] = undefined;
  });

  test('will start to using mouseEventHandler', () => {
    getMockedInstance(MouseEventHandler).handle = jest.fn();
    const mockedElement = document.createElement('e') as Element;
    translationHighlighter.listen(mockedElement as ElementWithMeta);
    expect(getMockedInstance(MouseEventHandler).handle).toBeCalledTimes(1);
  });

  describe('passing UI', () => {
    const checkIt = async () => {
      const mockedElement = createElement(20, 20, true);
      translationHighlighter.listen(mockedElement);
      await savedCallback(openEvent);
      expect(rendererViewerMock).toBeCalledTimes(1);
    };

    test('Works when UI is provided using promise provider', async () => {
      getMockedInstance(Properties).config.ui = getUiClassMock();
      await checkIt();
    });

    test('Works when UI is provided using promise provider', async () => {
      getMockedInstance(Properties).config.ui = () =>
        new Promise((resolve) => resolve(getUiClassMock()));
      await checkIt();
    });

    test('works when UI is provided using window provider', async () => {
      getMockedInstance(Properties).config.ui = undefined;
      window['@tolgee/ui'] = () =>
        new Promise((resolve) => resolve(getUiClassMock()));
      await checkIt();
    });

    test('works when UI is provided using window constructor', async () => {
      getMockedInstance(Properties).config.ui = undefined;
      window['@tolgee/ui'] = getUiClassMock();
      await checkIt();
    });
  });

  describe('key rendering', () => {
    test('will open renderer key context menu when multiple nodes', async () => {
      await testNodeCounts(2, 1);
    });

    test('will open renderer key context menu when multiple keys', async () => {
      await testNodeCounts(1, 10);
    });

    test('will open translation dialog when single key', async () => {
      const mockedElement = createElement(1, 1, true);
      translationHighlighter.listen(mockedElement);
      await savedCallback(openEvent);

      expect(rendererViewerMock).toBeCalledTimes(1);
      expect(rendererViewerMock).toBeCalledWith('key', 'default value');
    });

    test('will open translation dialog when single key multiplied', async () => {
      const mockedElement = createElement(20, 20, true);
      translationHighlighter.listen(mockedElement);
      await savedCallback(openEvent);

      expect(rendererViewerMock).toBeCalledTimes(1);
      expect(rendererViewerMock).toBeCalledWith('key', 'default value');
    });
  });

  describe('warnings & errors', () => {
    test('will print error on no key', async () => {
      // eslint-disable-next-line no-console
      console.error = jest.fn();
      rendererGetKeyMock = jest.fn(async (): Promise<string> => {
        return;
      });

      rendererViewerMock = jest.fn();

      getMockedInstance(Properties).config.ui = classMock<any>(
        () => ({
          getKey: rendererGetKeyMock,
        }),
        function () {
          return {};
        } as any
      );

      translationHighlighter.listen(createElement(0, 0));

      await savedCallback(openEvent);

      // eslint-disable-next-line no-console
      expect(console.error).toBeCalledTimes(1);
    });

    test('will print warning when UI not provided', async () => {
      // eslint-disable-next-line no-console
      console.warn = jest.fn();

      getMockedInstance(Properties).config.ui = null;

      translationHighlighter.listen(createElement(1, 1));

      await savedCallback(openEvent);

      // eslint-disable-next-line no-console
      expect(console.warn).toBeCalledTimes(1);
    });
  });

  let savedCallback: (e: MouseEvent) => void;

  let rendererGetKeyMock: (...args) => Promise<string>;
  let rendererViewerMock: (...args) => void;

  beforeEach(() => {
    rendererGetKeyMock = jest.fn(async (): Promise<string> => {
      return 'test';
    });

    rendererViewerMock = jest.fn();
    getMockedInstance(Properties).config.ui = getUiClassMock();

    getMockedInstance(MouseEventHandler).handle = (element, callback) => {
      savedCallback = callback;
    };
  });

  const openEvent = new MouseEvent('click');

  const testNodeCounts = async (nodeCount, keyCount) => {
    const mockedElement = createElement(nodeCount, keyCount);
    translationHighlighter.listen(mockedElement);
    await savedCallback(openEvent);
    expect(rendererGetKeyMock).toBeCalledTimes(1);

    const keySet = new Set();
    for (let i = 0; i < nodeCount * keyCount; i++) {
      keySet.add(`key ${i}`);
    }

    expect(rendererGetKeyMock).toBeCalledTimes(1);
    expect(rendererGetKeyMock).toBeCalledWith({ keys: keySet, openEvent });
    expect(rendererGetKeyMock).not.toBeCalledWith({
      keys: new Set(['key 0']),
      openEvent,
    });
  };

  const getUiClassMock = () =>
    classMock<any>(
      () => ({
        getKey: rendererGetKeyMock,
        renderViewer: rendererViewerMock,
      }),
      function () {
        return {};
      } as any
    );
});
