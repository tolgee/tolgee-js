jest.dontMock('./TranslationHighlighter');
jest.dontMock('../services/DependencyService');

import { TranslationHighlighter } from './TranslationHighlighter';
import classMock from '@testFixtures/classMock';
import { getMockedInstance } from '@testFixtures/mocked';
import { Properties } from '../Properties';
import { createElement } from '@testFixtures/createElement';
import { DependencyService } from '../services/DependencyService';

describe('TranslationHighlighter', () => {
  let translationHighlighter: TranslationHighlighter;

  beforeEach(async () => {
    const dependencyService = new DependencyService();
    dependencyService.init({});
    translationHighlighter = dependencyService.translationHighlighter;
  });

  afterEach(async () => {
    jest.clearAllMocks();
    window['@tolgee/ui'] = undefined;
  });

  describe('passing UI', () => {
    const checkIt = async () => {
      const mockedElement = createElement(20, 20, true);
      translationHighlighter.listen(mockedElement);
      await translationHighlighter.translationEdit(openEvent, mockedElement);
      expect(rendererViewerMock).toBeCalledTimes(1);
    };

    test('Works when UI is provided using regular provider', async () => {
      getMockedInstance(Properties).config.ui = getUiClassMock();
      await checkIt();
    });

    test('Works when UI is provided using promise provider', async () => {
      // @ts-ignore
      getMockedInstance(Properties).config.ui = new Promise((resolve) =>
        resolve(getUiClassMock())
      );
      await checkIt();
    });

    test('works when UI is provided using window provider', async () => {
      getMockedInstance(Properties).config.ui = undefined;
      window['@tolgee/ui'] = {
        UI: getUiClassMock(),
      };

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
      await translationHighlighter.translationEdit(openEvent, mockedElement);

      expect(rendererViewerMock).toBeCalledTimes(1);
      expect(rendererViewerMock).toBeCalledWith('key', 'default value');
    });

    test('will open translation dialog when single key multiplied', async () => {
      const mockedElement = createElement(20, 20, true);
      translationHighlighter.listen(mockedElement);
      await translationHighlighter.translationEdit(openEvent, mockedElement);

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

      const mockedElement = createElement(0, 0);
      translationHighlighter.listen(mockedElement);

      await translationHighlighter.translationEdit(openEvent, mockedElement);

      // eslint-disable-next-line no-console
      expect(console.error).toBeCalledTimes(1);
    });

    test('will print warning when UI not provided', async () => {
      // eslint-disable-next-line no-console
      console.warn = jest.fn();

      getMockedInstance(Properties).config.ui = null;

      const mockedElement = createElement(1, 1);
      translationHighlighter.listen(mockedElement);

      await translationHighlighter.translationEdit(openEvent, mockedElement);

      // eslint-disable-next-line no-console
      expect(console.warn).toBeCalledTimes(1);
    });
  });

  let rendererGetKeyMock: (...args) => Promise<string>;
  let rendererViewerMock: (...args) => void;

  beforeEach(() => {
    rendererGetKeyMock = jest.fn(async (): Promise<string> => {
      return 'test';
    });

    rendererViewerMock = jest.fn();
    getMockedInstance(Properties).config.ui = getUiClassMock();
  });

  const openEvent = new MouseEvent('click');

  const testNodeCounts = async (nodeCount, keyCount) => {
    const mockedElement = createElement(nodeCount, keyCount);
    translationHighlighter.listen(mockedElement);
    await translationHighlighter.translationEdit(openEvent, mockedElement);
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
