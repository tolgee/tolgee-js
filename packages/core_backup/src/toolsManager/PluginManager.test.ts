jest.dontMock('./PluginManager');
jest.dontMock('../services/DependencyService');

import { ElementWithMeta } from '../types';
import { ElementRegistrar } from '../services/ElementRegistrar';
import { getMockedInstance } from '@testFixtures/mocked';
import { PluginManager } from './PluginManager';
import { DependencyService } from '../services/DependencyService';
import { TranslationService } from '../services/TranslationService';
import { Messages } from './Messages';

describe('PluginManager', () => {
  let pluginManager: PluginManager;

  beforeEach(async () => {
    pluginManager = new DependencyService().pluginManager;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Can be created', () => {
    expect(pluginManager).toBeInstanceOf(PluginManager);
  });

  describe('take screenshot methods', () => {
    const data = {
      key: 'test_key',
      translations: { en: 'English!' },
    };

    let resolve;
    const highlightMock = jest.fn();
    const unHighlightMock = jest.fn();
    let listenCallback;
    const cancelMock = jest.fn();
    const revertMock = jest.fn();

    beforeEach(async () => {
      getMockedInstance(TranslationService).changeTranslations = jest.fn(
        () =>
          new Promise((r) => {
            resolve = r;
          })
      );

      getMockedInstance(ElementRegistrar).findAllByKey = jest.fn(() => {
        const element = document.createElement(
          'span'
        ) as any as ElementWithMeta;
        element._tolgee = {
          highlight: highlightMock,
          unhighlight: unHighlightMock,
        } as any;

        return [element];
      });

      (getMockedInstance(Messages) as any).send = jest.fn();

      (getMockedInstance(Messages) as any).listen = jest.fn((_, callback) => {
        listenCallback = callback;
        return cancelMock;
      });

      pluginManager.takeScreenshot(data);
      resolve(revertMock);
    });

    test('calls change translation', () => {
      expect(
        getMockedInstance(TranslationService).changeTranslations
      ).toHaveBeenCalledWith(data);
    });

    test('sends the message to take screenshots', () => {
      expect((getMockedInstance(Messages) as any).send).toHaveBeenCalledTimes(
        1
      );
    });

    test('highlights all', () => {
      expect(
        getMockedInstance(ElementRegistrar).findAllByKey
      ).toHaveBeenCalledWith(data.key);
      expect(
        getMockedInstance(ElementRegistrar).findAllByKey
      ).toHaveBeenCalledTimes(1);
      expect(highlightMock).toHaveBeenCalledTimes(1);
    });

    test('unhighlights all after', () => {
      listenCallback();
      expect(unHighlightMock).toHaveBeenCalledTimes(1);
    });

    test('reverts the translation change', () => {
      listenCallback();
      expect(revertMock).toHaveBeenCalledTimes(1);
    });

    test('cancels the listening', () => {
      listenCallback();
      expect(cancelMock).toHaveBeenCalledTimes(1);
    });
  });
});
