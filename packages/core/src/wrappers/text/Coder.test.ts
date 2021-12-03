jest.dontMock('./Coder');
jest.dontMock('../../services/DependencyService');
jest.dontMock('../../helpers/TextHelper');
jest.dontMock('../../services/TextService');
jest.dontMock('../../services/ModuleService');
jest.dontMock('../../modules/IcuFormatter');

import { DependencyService } from '../../services/DependencyService';
import { Coder } from './Coder';
import { getMockedInstance } from '@testFixtures/mocked';
import { TextService } from '../../services/TextService';
import { Properties } from '../../Properties';
import { TranslationService } from '../../services/TranslationService';
import { IcuFormatter } from '../../modules/IcuFormatter';

describe('Coder', () => {
  let mockedTranslationReturn = '';
  let textService: TextService;
  let coder: Coder;

  const getTranslationMock = jest.fn(async () => {
    return mockedTranslationReturn;
  });

  const getFromCacheOrCallbackMock = jest.fn(() => {
    return mockedTranslationReturn;
  });

  beforeEach(async () => {
    const depStore = new DependencyService();
    depStore.moduleService.addModule(IcuFormatter);
    depStore.run();
    textService = depStore.textService;
    mockedTranslationReturn = 'Dummy translated text {param1} {param2}';

    coder = new Coder(depStore.properties, textService);

    getMockedInstance(Properties).config = {
      inputPrefix: '{{',
      inputSuffix: '}}',
      restrictedElements: [],
      tagAttributes: {
        '*': ['aria-label'],
      },
    };
    getMockedInstance(TranslationService).getTranslation = getTranslationMock;

    getMockedInstance(TranslationService).getFromCacheOrFallback =
      getFromCacheOrCallbackMock;
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  test('replace function replaces occurrences correctly', async () => {
    const text =
      'This is text with params {{text:param1:hello,param2:hello 2 as well}}. Text continues';
    const replaced = await coder.unwrap(text);
    expect(replaced.text).toEqual(
      'This is text with params Dummy translated text hello hello 2 as well. Text continues'
    );
    expect(replaced.keys[0].key).toEqual('text');
    expect(replaced.keys[0].params['param1']).toEqual('hello');
    expect(replaced.keys[0].params['param2']).toEqual('hello 2 as well');
  });

  test('replace function does not replace when prefix is escaped', async () => {
    const text = 'This is text: {{text:param1:aaaa,param2:aaaa}} \\{{text}}';
    const replaced = await coder.unwrap(text);
    expect(replaced.text).toEqual(
      'This is text: Dummy translated text aaaa aaaa {{text}}'
    );
  });

  test("it doesn't affect not related backslashes", async () => {
    const text =
      '\\This is \\text: {{text:param1:aaaa,param2:aaaa}} \\{{text}}, see? \\';
    const replaced = await coder.unwrap(text);
    expect(replaced.text).toEqual(
      '\\This is \\text: Dummy translated text aaaa aaaa {{text}}, see? \\'
    );
  });

  test('correctly parses default value', async () => {
    const text =
      '\\This is \\text: {{text,This is my default value.\\:look!:param1:aaaa,param2:aaaa}} \\{{text}}, see? \\';
    await coder.unwrap(text);
    expect(getTranslationMock).toHaveBeenCalledWith(
      'text',
      undefined,
      'This is my default value.:look!'
    );
  });

  test('replace function does not translate when params have escaped , or :', async () => {
    const text =
      'This is text: {{text:param1:param 1 with\\,and \\:.,param2:hello \\:}}. Text continues';
    const replaced = await coder.unwrap(text);
    expect(replaced.text).toEqual(
      'This is text: Dummy translated text param 1 with,and :. hello :. Text continues'
    );
  });

  test('replace function does not translate when params have escaped \\', async () => {
    const text =
      'This is text: {{text:param1:param 1 with\\\\ and again \\\\,param2:hello \\\\}}. Text continues';
    const replaced = await coder.unwrap(text);
    expect(replaced.text).toEqual(
      'This is text: Dummy translated text param 1 with\\ and again \\ hello \\. Text continues'
    );
  });

  test('replace function works with new lines in key', async () => {
    mockedTranslationReturn = 'yep';
    const text = 'This is text: {{text\nwith\nnew\nlines}}. Text continues';
    await coder.unwrap(text);
    expect(getTranslationMock).toHaveBeenCalledWith(
      'text\nwith\nnew\nlines',
      undefined,
      undefined
    );
  });

  test('works with escaped strings in params', async () => {
    const text = 'Text: {{text\nwith\nnew\nlines:hello:w\\,or\\:ld}}.';
    mockedTranslationReturn = 'translated {hello}';
    const result = await coder.unwrap(text);
    expect(result.keys[0].params['hello']).toEqual('w,or:ld');
  });

  describe('Different key occurrences', () => {
    beforeEach(() => {
      getMockedInstance(TranslationService).getTranslation = jest.fn(
        async () => {
          return 'translated';
        }
      );
    });

    test('longer text will be handled correctly', async () => {
      const text =
        'This is standard text to translate: {{text}}. This is another one: {{text}}.\n' +
        'There is an text with slash before, but escaped: \\\\{{text}}\n' +
        'This is one with escaped prefix, to it shall not translate this one: \\{{aaa}}\n' +
        'There is another text: {{text}}\n' +
        'There are two texts to translate next to each other: {{text}}{{text}}. And after it text continues: {{text}}.\n' +
        'This is an end, finally.\n';

      const replaced = await coder.unwrap(text);

      expect(replaced.text).toEqual(
        'This is standard text to translate: translated. This is another one: translated.\n' +
          'There is an text with slash before, but escaped: \\translated\n' +
          'This is one with escaped prefix, to it shall not translate this one: {{aaa}}\n' +
          'There is another text: translated\n' +
          'There are two texts to translate next to each other: translatedtranslated. And after it text continues: translated.\n' +
          'This is an end, finally.\n'
      );
    });

    test('will translate correctly when the text begins with key', async () => {
      const text = '{{text}}, text continues';
      const replaced = await coder.unwrap(text);
      expect(replaced.text).toEqual('translated, text continues');
    });

    test('will not translate when there is nothing to translate', async () => {
      const text = '\\{{text}}, text continues';
      const replaced = await coder.unwrap(text);
      expect(replaced).toEqual(undefined);
    });

    test('will not translate when the text begins with escaped key', async () => {
      const text = '\\{{text}}, text continues {{other text}}';
      const replaced = await coder.unwrap(text);
      expect(replaced.text).toEqual('{{text}}, text continues translated');
    });

    test('will translate when the text begins with escaped escape character', async () => {
      const text = '\\\\{{text}}, text continues {{other text}}';
      const replaced = await coder.unwrap(text);
      expect(replaced.text).toEqual('\\translated, text continues translated');
    });

    test('will translate when the text begins with escaped escape character, what is escaped', async () => {
      const text = '\\\\\\{{text}}, text continues {{other text}}';
      const replaced = await coder.unwrap(text);
      expect(replaced.text).toEqual('\\\\{{text}}, text continues translated');
    });
  });

  describe('wrap function', () => {
    test('will correctly wrap text without params', () => {
      expect(coder.wrap('text')).toEqual('{{text}}');
    });

    test('will correctly wrap text with , and :', () => {
      expect(coder.wrap('text, other text: yes!')).toEqual(
        '{{text\\, other text\\: yes!}}'
      );
    });

    test('will correctly wrap text with ,, : and \\', () => {
      expect(coder.wrap('text, other text: \\ yes!')).toEqual(
        '{{text\\, other text\\: \\\\ yes!}}'
      );
    });

    test('will correctly wrap text with parameters', () => {
      expect(
        coder.wrap('text', {
          param1: 'the param value',
          param2: '2nd value',
        })
      ).toEqual('{{text:param1:the param value,param2:2nd value}}');
    });

    test('will correctly wrap text with parameters containing : an ,', () => {
      expect(
        coder.wrap('text', {
          param1: 'the param value: value, value2 or value3',
          param2: '2nd value',
        })
      ).toEqual(
        '{{text:param1:the param value\\: value\\, value2 or value3,param2:2nd value}}'
      );
    });

    test('it will correctly replace wrapped text', async () => {
      getMockedInstance(TranslationService).getTranslation = jest.fn(
        async () => {
          return 'xxx {param1} {param2} xxx';
        }
      );

      const wrapped = coder.wrap(
        'An longer key with some strange ,: ,: \\ characters',
        { param1: ',:,:', param2: '....\\...,' }
      );

      expect((await coder.unwrap(wrapped)).text).toEqual(
        'xxx ,:,: ....\\..., xxx'
      );
    });

    test('will correctly convert param to string', () => {
      const wrapped = coder.wrap('key', { param1: 1 });
      expect(wrapped).toEqual('{{key:param1:1}}');
    });

    test('will correctly replace number parameters', async () => {
      getMockedInstance(TranslationService).getTranslation = jest.fn(
        async () => {
          return 'xxx {param1, number} {param2, number} xxx';
        }
      );

      const wrapped = coder.wrap('key', { param1: 1, param2: 145.5 });
      expect((await coder.unwrap(wrapped)).text).toEqual('xxx 1 145.5 xxx');
    });

    test('correctly wraps default value', async () => {
      const wrapped = coder.wrap(
        'key',
        { param1: 1, param2: 'Yes,yes,yes:yes' },
        'Look: What a beautiful default\nvalue,' +
          ' translating will be such an experience.'
      );
      expect(wrapped).toEqual(
        '{{key,Look\\: What a beautiful default\n' +
          'value\\, translating will be such an experience.' +
          ':param1:1,param2:Yes\\,yes\\,yes\\:yes}}'
      );

      await coder.unwrap(wrapped);
      expect(getTranslationMock).toBeCalledWith(
        'key',
        undefined,
        'Look: What a beautiful default\nvalue, translating will be such an experience.'
      );
    });

    test('will correctly replace bigint parameter', async () => {
      getMockedInstance(TranslationService).getTranslation = jest.fn(
        async () => {
          return 'xxx {param1, number} {param2, number} xxx';
        }
      );

      const wrapped = coder.wrap('key', {
        param1: 1,
        param2: BigInt(129374),
      });
      expect((await coder.unwrap(wrapped)).text).toEqual('xxx 1 129,374 xxx');
    });
  });
});
