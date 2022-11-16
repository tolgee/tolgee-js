import { WrapperMiddleware } from '@tolgee/core';
import { TextWrapper } from './TextWrapper';

describe('Text wrapper', () => {
  let wrapper: WrapperMiddleware;
  beforeEach(() => {
    wrapper = TextWrapper({
      inputPrefix: '{{',
      inputSuffix: '}}',
      translate: ({ key, params, defaultValue }) =>
        `(${key || defaultValue},${Object.values(params || {}).join(',')})`,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('replace function replaces occurrences correctly', () => {
    const text =
      'This is text with params {{text:param1:hello,param2:hello 2 as well}}. Text continues';
    const replaced = wrapper.unwrap(text);
    expect(replaced.text).toEqual(
      'This is text with params (text,hello,hello 2 as well). Text continues'
    );
    expect(replaced.keys[0].key).toEqual('text');
    expect(replaced.keys[0].params?.['param1']).toEqual('hello');
    expect(replaced.keys[0].params?.['param2']).toEqual('hello 2 as well');
  });

  test('replace function does not replace when prefix is escaped', () => {
    const text = 'This is text: {{text:param1:aaaa,param2:aaaa}} \\{{text}}';
    const replaced = wrapper.unwrap(text);
    expect(replaced.text).toEqual('This is text: (text,aaaa,aaaa) {{text}}');
  });

  test("it doesn't affect not related backslashes", () => {
    const text =
      '\\This is \\text: {{text:param1:aaaa,param2:aaaa}} \\{{text}}, see? \\';
    const replaced = wrapper.unwrap(text);
    expect(replaced.text).toEqual(
      '\\This is \\text: (text,aaaa,aaaa) {{text}}, see? \\'
    );
  });

  test('correctly parses default value', () => {
    const text =
      '\\This is \\text: {{text,This is my default value.\\:look!:param1:aaaa,param2:aaaa}} \\{{text}}, see? \\';
    const replaced = wrapper.unwrap(text);
    expect(replaced.keys[0].defaultValue).toEqual(
      'This is my default value.:look!'
    );
  });

  test('correctly parses namespace', () => {
    const text = 'This is text: {{key|namespace}}';
    const replaced = wrapper.unwrap(text);
    expect(replaced.keys[0].ns).toEqual('namespace');
  });

  test('replace function does not translate when params have escaped , or :', () => {
    const text =
      'This is text: {{text:param1:param 1 with\\,and \\:.,param2:hello \\:}}. Text continues';
    const replaced = wrapper.unwrap(text);
    expect(replaced.text).toEqual(
      'This is text: (text,param 1 with,and :.,hello :). Text continues'
    );
  });

  test('replace function does not translate when params have escaped \\', () => {
    const text =
      'This is text: {{text:param1:param 1 with\\\\ and again \\\\,param2:hello \\\\}}. Text continues';
    const replaced = wrapper.unwrap(text);
    expect(replaced.text).toEqual(
      'This is text: (text,param 1 with\\ and again \\,hello \\). Text continues'
    );
  });

  test('replace function works with new lines in key', () => {
    const text = 'This is text: {{text\nwith\nnew\nlines}}. Text continues';
    const replaced = wrapper.unwrap(text);
    expect(replaced.text).toEqual(
      'This is text: (text\nwith\nnew\nlines,). Text continues'
    );
  });

  test('works with escaped strings in params', () => {
    const text = 'Text: {{text\nwith\nnew\nlines:hello:w\\,or\\:ld}}.';
    const result = wrapper.unwrap(text);
    expect(result.keys[0].params?.['hello']).toEqual('w,or:ld');
  });

  describe('Different key occurrences', () => {
    beforeEach(() => {
      wrapper = TextWrapper({
        inputPrefix: '{{',
        inputSuffix: '}}',
        translate: () => 'translated',
      });
    });

    test('longer text will be handled correctly', () => {
      const text =
        'This is standard text to translate: {{text}}. This is another one: {{text}}.\n' +
        'There is an text with slash before, but escaped: \\\\{{text}}\n' +
        'This is one with escaped prefix, to it shall not translate this one: \\{{aaa}}\n' +
        'There is another text: {{text}}\n' +
        'There are two texts to translate next to each other: {{text}}{{text}}. And after it text continues: {{text}}.\n' +
        'This is an end, finally.\n';

      const replaced = wrapper.unwrap(text);

      expect(replaced.text).toEqual(
        'This is standard text to translate: translated. This is another one: translated.\n' +
          'There is an text with slash before, but escaped: \\translated\n' +
          'This is one with escaped prefix, to it shall not translate this one: {{aaa}}\n' +
          'There is another text: translated\n' +
          'There are two texts to translate next to each other: translatedtranslated. And after it text continues: translated.\n' +
          'This is an end, finally.\n'
      );
    });

    test('will translate correctly when the text begins with key', () => {
      const text = '{{text}}, text continues';
      const replaced = wrapper.unwrap(text);
      expect(replaced.text).toEqual('translated, text continues');
    });

    test('will not translate when there is nothing to translate', () => {
      const text = '\\{{text}}, text continues';
      const replaced = wrapper.unwrap(text);
      expect(replaced.keys).toEqual([]);
    });

    test('will not translate when the text begins with escaped key', () => {
      const text = '\\{{text}}, text continues {{other text}}';
      const replaced = wrapper.unwrap(text);
      expect(replaced.text).toEqual('{{text}}, text continues translated');
    });

    test('will translate when the text begins with escaped escape character', () => {
      const text = '\\\\{{text}}, text continues {{other text}}';
      const replaced = wrapper.unwrap(text);
      expect(replaced.text).toEqual('\\translated, text continues translated');
    });

    test('will translate when the text begins with escaped escape character, what is escaped', () => {
      const text = '\\\\\\{{text}}, text continues {{other text}}';
      const replaced = wrapper.unwrap(text);
      expect(replaced.text).toEqual('\\\\{{text}}, text continues translated');
    });
  });

  describe('wrap function', () => {
    test('will correctly wrap text without params', () => {
      expect(wrapper.wrap({ key: 'text' })).toEqual('{{text}}');
    });

    test('will correctly wrap text with , and :', () => {
      expect(wrapper.wrap({ key: 'text, other text: yes!' })).toEqual(
        '{{text\\, other text\\: yes!}}'
      );
    });

    test('will correctly wrap text with ,, : and \\', () => {
      expect(wrapper.wrap({ key: 'text, other text: \\ yes!' })).toEqual(
        '{{text\\, other text\\: \\\\ yes!}}'
      );
    });

    test('will correctly wrap text with parameters', () => {
      expect(
        wrapper.wrap({
          key: 'text',
          params: {
            param1: 'the param value',
            param2: '2nd value',
          },
        })
      ).toEqual('{{text:param1:the param value,param2:2nd value}}');
    });

    test('will correctly wrap text with parameters containing : an ,', () => {
      expect(
        wrapper.wrap({
          key: 'text',
          params: {
            param1: 'the param value: value, value2 or value3',
            param2: '2nd value',
          },
        })
      ).toEqual(
        '{{text:param1:the param value\\: value\\, value2 or value3,param2:2nd value}}'
      );
    });

    test('it will correctly replace wrapped text', () => {
      const wrapped = wrapper.wrap({
        key: 'An longer key with some strange ,: ,: \\ characters',
        params: { param1: ',:,:', param2: '....\\...,' },
      });

      expect(wrapper.unwrap(wrapped).text).toEqual(
        '(An longer key with some strange ,: ,: \\ characters,,:,:,....\\...,)'
      );
    });

    test('will correctly convert param to string', () => {
      const wrapped = wrapper.wrap({ key: 'key', params: { param1: 1 } });
      expect(wrapped).toEqual('{{key:param1:1}}');
    });

    test('correctly wraps default value', () => {
      const wrapped = wrapper.wrap({
        key: 'key',
        params: { param1: 1, param2: 'Yes,yes,yes:yes' },
        defaultValue:
          'Look: What a beautiful default\nvalue,' +
          ' translating will be such an experience.',
      });
      expect(wrapped).toEqual(
        '{{key,Look\\: What a beautiful default\n' +
          'value\\, translating will be such an experience.' +
          ':param1:1,param2:Yes\\,yes\\,yes\\:yes}}'
      );

      const result = wrapper.unwrap(wrapped);
      expect(result.keys[0].defaultValue).toEqual(
        'Look: What a beautiful default\nvalue, translating will be such an experience.'
      );
    });

    test('will correctly replace bigint parameter', () => {
      const wrapped = wrapper.wrap({
        key: 'key',
        params: {
          param1: 1,
          param2: BigInt(129374),
        },
      });
      expect(wrapper.unwrap(wrapped).text).toEqual('(key,1,129374)');
    });
  });
});
