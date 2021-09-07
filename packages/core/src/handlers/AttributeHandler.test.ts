jest.dontMock('./AttributeHandler');
jest.dontMock('./AbstractHandler');
jest.dontMock('../services/EventService');
jest.dontMock('../helpers/NodeHelper.ts');
jest.dontMock('../services/DependencyStore');

import { Properties } from '../Properties';
import { AttributeHandler } from './AttributeHandler';
import { ElementWithMeta, NodeWithMeta } from '../types';
import { NodeHelper } from '../helpers/NodeHelper';
import { createTestDom } from '@testFixtures/createTestDom';
import { ReplacedType, TextService } from '../services/TextService';
import { getMockedInstance } from '@testFixtures/mocked';
import { ElementRegistrar } from '../services/ElementRegistrar';
import { DependencyStore } from '../services/DependencyStore';

describe('AttributeHandler', () => {
  let attributeHandler: AttributeHandler;

  const mockedKeys = [
    {
      key: 'dummyKey',
      params: { dummyParam: 'dummyValue' },
    },
  ];

  const mockedTranslateInner = (text) => {
    return {
      text: text.replace(/{{(.*?)}}/gs, '$1'),
      keys: mockedKeys,
    } as ReplacedType;
  };

  const gv = (key) => mockedTranslateInner(key).text;
  const mockedTranslate = jest.fn(mockedTranslateInner);
  let c: ReturnType<typeof createTestDom>;

  beforeEach(() => {
    c = createTestDom(document);
    attributeHandler = new DependencyStore().attributeHandler;
    getMockedInstance(Properties).config = {
      inputPrefix: '{{',
      inputSuffix: '}}',
      restrictedElements: [],
      tagAttributes: {
        '*': ['aria-label'],
      },
      passToParent: ['option'],
    };
    getMockedInstance(TextService).replace = async (...args) =>
      mockedTranslate(...args);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  describe('in production mode', () => {
    let xPath: string;

    beforeEach(async () => {
      await attributeHandler.handle(document.body);
      xPath = `./div/div/@aria-label[contains(., '${gv(c.ariaLabelKey)}')]`;
    });

    test('Can be created', () => {
      expect(attributeHandler).not.toBeUndefined();
    });

    test('will handle text in aria-label attribute of div', async () => {
      expect(xPath).toBeFoundIn(document.body);
    });

    describe("Node's _tolgee property", () => {
      let node: NodeWithMeta;

      beforeEach(() => {
        node = NodeHelper.evaluateToSingle(
          xPath,
          document.body
        ) as NodeWithMeta;
      });

      test('will be defined', () => {
        expect(node._tolgee).toBeDefined();
      });
    });

    describe("Parent element's _tolgee property", () => {
      let element: ElementWithMeta;
      let node: NodeWithMeta;

      beforeEach(() => {
        node = NodeHelper.evaluateToSingle(xPath, document.body);
        element = (node as any as Attr).ownerElement as any as ElementWithMeta;
      });

      test('will be defined', () => {
        expect(element._tolgee).toBeDefined();
      });
    });
  });

  test('will register the node', async () => {
    await attributeHandler.handle(document.body);
    const xPath = `./div/div/@aria-label[contains(., '${gv(c.ariaLabelKey)}')]`;
    const node = NodeHelper.evaluateToSingle(xPath, document.body) as Attr;
    expect(getMockedInstance(ElementRegistrar).register).toBeCalledWith(
      node.ownerElement
    );
  });
});
