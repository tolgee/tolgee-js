jest.dontMock('./CoreHandler');
jest.dontMock('./TextWrapper');
jest.dontMock('../../helpers/NodeHelper');
jest.dontMock('../../services/EventEmitter');
jest.dontMock('../../services/DependencyService');

import { CoreHandler } from './CoreHandler';
import { getMockedInstance } from '@testFixtures/mocked';
import { ContentHandler } from './ContentHandler';
import { AttributeHandler } from './AttributeHandler';
import { EventService } from '../../services/EventService';
import { EventEmitterImpl } from '../../services/EventEmitter';
import { mocked } from 'ts-jest/utils';
import { TranslationData } from '../../types/DTOs';
import { Properties } from '../../Properties';
import { ElementMeta, NodeMeta, NodeWithMeta, Unwrapped } from '../../types';
import { DependencyService } from '../../services/DependencyService';
import { Coder } from './Coder';

describe('CoreHandler', () => {
  const mockedTranslationChanged = new EventEmitterImpl<TranslationData>();
  const mockedLanguageChanged = new EventEmitterImpl<string>();
  const mockedUnwrap: Unwrapped = {
    keys: [{} as any],
    text: 'This is refreshed',
  };

  mocked(EventService).mockImplementation(() => {
    return {
      TRANSLATION_CHANGED: mockedTranslationChanged,
      LANGUAGE_CHANGED: mockedLanguageChanged,
      LANGUAGE_LOADED: null,
      ELEMENT_REGISTERED: null,
    } as EventService;
  });

  mocked(Coder).mockImplementation(() => {
    return {
      unwrap: jest.fn(() => mockedUnwrap),
    } as any as Coder;
  });

  let coreHandler: CoreHandler;

  beforeEach(async () => {
    const dependencyStore = new DependencyService();
    dependencyStore.init({});

    // @ts-ignore
    coreHandler = dependencyStore.wrapper.coreHandler;
    getMockedInstance(Properties).config.targetElement = document.body;
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  test('Can be created', () => {
    expect(coreHandler).not.toBeUndefined();
  });

  describe('handleSubtree function', () => {
    beforeEach(async () => {
      await coreHandler.handleSubtree(document.body);
    });

    test('will call basic text handler', async () => {
      expect(getMockedInstance(ContentHandler).handle).toBeCalledWith(
        document.body
      );
      expect(getMockedInstance(ContentHandler).handle).toBeCalledTimes(1);
    });

    test('will call attribute handler', async () => {
      expect(getMockedInstance(AttributeHandler).handle).toBeCalledWith(
        document.body
      );
      expect(getMockedInstance(AttributeHandler).handle).toBeCalledTimes(1);
    });
  });

  describe('refresh', () => {
    const pgDiv = document.createElement('div');
    pgDiv.setAttribute('_tolgee', '');
    const textNode = document.createTextNode('Translated text');
    textNode['_tolgee'] = {
      oldTextContent: 'some_translation_key',
    } as NodeMeta;
    pgDiv['_tolgee'] = {
      nodes: new Set([textNode as any as NodeWithMeta]),
    } as ElementMeta;
    pgDiv.append(textNode);

    beforeEach(async () => {
      document.body = document.createElement('body');
      document.body.append(pgDiv);

      await mockedLanguageChanged.emit('aaa');
      await mockedTranslationChanged.emit(null);
    });

    test('will refresh the text', async () => {
      expect(textNode.textContent).toEqual(mockedUnwrap.text);
    });
  });
});
