jest.dontMock('./TextHandler');
jest.dontMock('./AbstractHandler');
jest.dontMock('../services/EventService');
jest.dontMock('../helpers/NodeHelper.ts');
jest.dontMock('../services/DependencyStore');

import { TextHandler } from './TextHandler';
import '@testing-library/jest-dom/extend-expect';
import { ElementWithMeta, NodeWithMeta } from '../types';
import { NodeHelper } from '../helpers/NodeHelper';
import { createTestDom } from '@testFixtures/createTestDom';
import { ReplacedType, TextService } from '../services/TextService';
import { getMockedInstance } from '@testFixtures/mocked';
import { ElementRegistrar } from '../services/ElementRegistrar';
import { Properties } from '../Properties';
import { DependencyStore } from '../services/DependencyStore';

describe('TextHandler', () => {
  let textHandler: TextHandler;

  const mockedKeys = [
    {
      key: 'dummyKey',
      params: { dummyParam: 'dummyValue' },
    },
  ];

  const mockedTranslateInner = (text) => {
    return {
      text: text.replace(/{{(.*?)}}/gs, 'translated $1'),
      keys: mockedKeys,
    } as ReplacedType;
  };

  const gv = (key) => mockedTranslateInner(key).text;
  const mockedTranslate = jest.fn(mockedTranslateInner);
  let c: ReturnType<typeof createTestDom>;
  beforeEach(() => {
    textHandler = new DependencyStore().textHandler;
    getMockedInstance(Properties).config = {
      inputPrefix: '{{',
      inputSuffix: '}}',
      restrictedElements: [],
      tagAttributes: {
        '*': ['aria-label'],
      },
      passToParent: ['option'],
    };
    c = createTestDom(document);
    getMockedInstance(TextService).replace = async (...args) =>
      mockedTranslate(...args);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  describe('in production mode', () => {
    beforeEach(async () => {
      await textHandler.handle(document.body);
    });

    test('Can be created', () => {
      expect(textHandler).not.toBeUndefined();
    });

    test('will handle text in root', async () => {
      expect(`./text()[contains(., ${gv(c.keyInRoot)})]`).toBeFoundIn(
        document.body
      );
    });

    test('will handle text in div', async () => {
      expect(
        `./div/text()[contains(., 'Some trash... translated ${gv(
          c.keyInRootDiv
        )}')]`
      ).toBeFoundIn(document.body);
    });

    test('will handle text in div > div > span', async () => {
      const xpath = `./div/div/span/text()[contains(., 'translated ${gv(
        c.hereKey
      )} and translated ${gv(c.hereTooKey)}')]`;
      expect(xpath).toBeFoundIn(document.body);
    });

    describe("Node's _tolgee property", () => {
      let node: NodeWithMeta;

      beforeEach(() => {
        node = NodeHelper.evaluateToSingle(
          `./text()[contains(., ${gv(c.keyInRoot)})]`,
          document.body
        ) as NodeWithMeta;
      });

      test('will be defined', () => {
        expect(node._tolgee).toBeDefined();
      });

      test('will have proper oldTextContent', () => {
        expect(node._tolgee.oldTextContent).toContain(`{{${c.keyInRoot}}}`);
      });

      test('will have proper keys length', () => {
        expect(node._tolgee.keys).toHaveLength(1);
      });

      test('will have proper first key', () => {
        expect(node._tolgee.keys).toEqual(mockedKeys);
      });
    });

    test('will lock the node', async () => {
      c = createTestDom(document);
      const node = NodeHelper.evaluateToSingle(
        `./text()[contains(., ${gv(c.keyInRoot)})]`,
        document.body
      ) as NodeWithMeta;
      let resolve;
      getMockedInstance(TextService).replace = () =>
        new Promise((r) => (resolve = r));
      const promise = textHandler.handle(node);
      await new Promise((r) => setTimeout(r));
      expect(node._tolgee.locked).toEqual(true);
      resolve();
      await promise;
      expect(node._tolgee.locked).toEqual(false);
    });

    describe("Parent element's _tolgee property and attribute", () => {
      let element: ElementWithMeta;
      let node: NodeWithMeta;

      beforeEach(() => {
        node = NodeHelper.evaluateToSingle(
          `./text()[contains(., ${gv(c.keyInRoot)})]`,
          document.body
        );
        element = node.parentElement as any as ElementWithMeta;
      });

      test('property will be defined', () => {
        expect(element._tolgee).toBeDefined();
      });

      test('will contain nodes array with correct node', () => {
        expect(element._tolgee.nodes).toEqual(new Set([node]));
      });

      test('attribute will be set', () => {
        expect(element.getAttribute('_tolgee')).toEqual('');
      });
    });

    test("will pass option's text node to select element", () => {
      const xPath = `//text()[contains(., 'translated option_key')]`;
      const node = NodeHelper.evaluateToSingle(xPath, document.body);
      expect(node.parentElement.parentElement).toHaveAttribute('_tolgee', '');
      expect(node.parentElement).not.toHaveAttribute('_tolgee');
    });
  });

  test('will pass recursively', async () => {
    getMockedInstance(Properties).config.passToParent = ['option', 'select'];
    await textHandler.handle(document.body);
    const xPath = `//text()[contains(., 'translated option_key')]`;
    const node = NodeHelper.evaluateToSingle(xPath, document.body);
    expect(node.parentElement.parentElement.parentElement).toHaveAttribute(
      '_tolgee',
      ''
    );
    expect(node.parentElement.parentElement).not.toHaveAttribute('_tolgee');
  });

  test('will pass with function', async () => {
    getMockedInstance(Properties).config.passToParent = (element) =>
      element.tagName === 'OPTION';
    await textHandler.handle(document.body);
    const xPath = `//text()[contains(., 'translated option_key')]`;
    const node = NodeHelper.evaluateToSingle(xPath, document.body);
    expect(node.parentElement.parentElement).toHaveAttribute('_tolgee', '');
    expect(node.parentElement).not.toHaveAttribute('_tolgee');
  });

  test('will register the node', async () => {
    await textHandler.handle(document.body);
    const node = NodeHelper.evaluateToSingle(
      `./text()[contains(., ${gv(c.keyInRoot)})]`,
      document.body
    );
    expect(getMockedInstance(ElementRegistrar).register).toBeCalledWith(
      node.parentElement
    );
  });
});
