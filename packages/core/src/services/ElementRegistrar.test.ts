jest.dontMock('./ElementRegistrar');
jest.dontMock('./DependencyStore');

import '@testing-library/jest-dom/extend-expect';
import { ElementRegistrar } from './ElementRegistrar';
import { ElementWithMeta } from '../types';
import { getMockedInstance } from '@testFixtures/mocked';
import { TranslationHighlighter } from '../highlighter/TranslationHighlighter';
import { createElement } from '@testFixtures/createElement';
import { Properties } from '../Properties';
import { TOLGEE_ATTRIBUTE_NAME } from '../Constants/Global';
import { DependencyStore } from './DependencyStore';
import { EventEmitterImpl } from './EventEmitter';
import { EventService } from './EventService';

describe('ElementRegistrar', () => {
  let elementRegistrar: ElementRegistrar;
  const mockElementRegisteredEmit = jest.fn();

  beforeEach(async () => {
    elementRegistrar = new DependencyStore().elementRegistrar;
    (getMockedInstance(EventService).ELEMENT_REGISTERED as any) = {
      emit: mockElementRegisteredEmit,
    } as any as EventEmitterImpl<ElementWithMeta>;
    getMockedInstance(Properties).config.targetElement = document.body;
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  describe('In development mode', () => {
    const element = createElement(1, 1);

    beforeEach(async () => {
      getMockedInstance(Properties).config.mode = 'development';
      document.body.append(element);
      await elementRegistrar.register(element);
    });

    test('will be registered for highlighting in development mode', () => {
      expect(getMockedInstance(TranslationHighlighter).listen).toBeCalledWith(
        element
      );
      expect(getMockedInstance(TranslationHighlighter).listen).toBeCalledTimes(
        1
      );
    });

    test('will emit element registered event', () => {
      expect(mockElementRegisteredEmit).toBeCalledTimes(1);
      expect(mockElementRegisteredEmit).toBeCalledWith(element);
    });
  });

  test('throws error on register element without any node', async () => {
    const element = createElement(0, 0);
    getMockedInstance(Properties).config.mode = 'development';
    document.body.append(element);
    elementRegistrar.register(element);
    expect((elementRegistrar as any).registeredElements).toBeInstanceOf(Set);
    expect((elementRegistrar as any).registeredElements).not.toContain(element);
  });

  describe('register, clean & refresh methods', () => {
    let mockedElements: ElementWithMeta[];
    beforeEach(() => {
      mockedElements = [
        createElement(5, 0),
        createElement(1, 0),
        createElement(3, 0),
      ];
      document.body.append(...mockedElements);
      mockedElements.forEach((e) => elementRegistrar.register(e));
    });

    test('refresh all will remove inactive elements', () => {
      const node = mockedElements[1]._tolgee.nodes.values().next().value;
      node.parentElement.removeChild(node);
      elementRegistrar.refreshAll();
      expect(mockedElements[1]._tolgee).not.toBeDefined();
      expect(mockedElements[1]).not.toHaveAttribute(TOLGEE_ATTRIBUTE_NAME);
    });

    test('refresh all will remove inactive nodes', () => {
      const node = mockedElements[2]._tolgee.nodes.values().next().value;
      node.parentElement.removeChild(node);
      elementRegistrar.refreshAll();
      expect(mockedElements[2]._tolgee.nodes.size).toEqual(2);
    });

    test('removal will call remove all event listeners method', () => {
      const mockedCallback = jest.fn();
      mockedElements[1]._tolgee.removeAllEventListeners = mockedCallback;
      const node = mockedElements[1]._tolgee.nodes.values().next().value;
      node.parentElement.removeChild(node);
      elementRegistrar.refreshAll();
      expect(mockedCallback).toBeCalledTimes(1);
    });

    test('clean all will clean all elements', () => {
      elementRegistrar.cleanAll();
      for (const mockedElement of mockedElements) {
        expect(mockedElement._tolgee).not.toBeDefined();
      }
    });

    test("clean all doesn't clean elements with preventClean", () => {
      mockedElements[1]._tolgee.preventClean = true;
      const node = mockedElements[1]._tolgee.nodes.values().next().value;
      node.parentElement.removeChild(node);
      elementRegistrar.refreshAll();
      expect(mockedElements[1]._tolgee).toBeDefined();
      expect(mockedElements[1]).toHaveAttribute(TOLGEE_ATTRIBUTE_NAME);
    });

    test("refresh all doesn't delete nodes on elements wih preventClean", () => {
      mockedElements[1]._tolgee.preventClean = true;
      const node = mockedElements[1]._tolgee.nodes.values().next().value;
      node.parentElement.removeChild(node);
      elementRegistrar.refreshAll();
      expect(mockedElements[1]._tolgee).toBeDefined();
    });
  });

  test('will register attribute node', () => {
    const inputElement = document.createElement(
      'input'
    ) as any as ElementWithMeta;
    document.body.append(inputElement);
    inputElement.setAttribute('_tolgee', '');
    inputElement.setAttribute('placeholder', 'Text');
    inputElement._tolgee = {
      nodes: new Set([inputElement.attributes['placeholder']]),
    };
    elementRegistrar.register(inputElement);
  });
});
