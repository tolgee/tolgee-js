import { TranslateParams } from '../types';
import IntlMessageFormat from 'intl-messageformat';
import { formatter } from './formatter';
import {
  ErrorCode,
  ERROR_PARAM_EMPTY,
  ERROR_UNEXPECTED_CHAR,
  ERROR_UNEXPECTED_END,
  FormatError,
} from './FormatError';

function icu(text: string, params?: TranslateParams) {
  return new IntlMessageFormat(text, 'en', undefined, {
    ignoreTag: true,
  }).format(params);
}

function getText() {
  return expect.getState().currentTestName.replace('simple formatter ', '');
}

function matchIcu(params?: TranslateParams) {
  const text = getText();
  expect(formatter(text, params)).toEqual(icu(text, params));
}

function expectToThrow(
  text: string,
  code?: ErrorCode,
  params?: TranslateParams
) {
  let error: FormatError | undefined = undefined;
  try {
    formatter(text, params);
  } catch (e) {
    error = e as FormatError;
  }
  expect(error).toBeInstanceOf(FormatError);
  expect(error?.code).toEqual(code);
}

function expectToThrowWithIcu(code?: ErrorCode, params?: TranslateParams) {
  const text = getText();
  expect(() => icu(text, params)).toThrow();
  expectToThrow(text, code, params);
}

function unsupported(code?: ErrorCode, params?: TranslateParams) {
  const text = getText();
  expect(() => icu(text, params)).not.toThrow();
  expectToThrow(text, code, params);
}

function combineChars(chars: string[]) {
  const result: string[] = [];
  chars.forEach((char) => {
    [`start${char}`, `${char}end`, `mid${char}dle`, char].forEach((param) => {
      result.push(param);
    });
  });
  return result;
}

function characterInParamSupported(chars: string[]) {
  combineChars(chars).forEach((param) => {
    const text = `test { ${param} } param`;
    it(`works with: ${text}`, () => {
      const params = { [param]: 'valid' };
      expect(icu(text, params)).toEqual('test valid param');
      expect(formatter(text, params)).toEqual('test valid param');
    });
  });
}

function characterInParamFailWithIcu(chars: string[]) {
  combineChars(chars).forEach((param) => {
    const text = `test { ${param} } param`;
    it(`fails with: ${text}`, () => {
      const params = { [param]: 'test' };
      expect(() => icu(text, params)).toThrow();
      expectToThrow(text, ERROR_UNEXPECTED_CHAR, params);
    });
  });
}

function characterInParamFail(chars: string[]) {
  combineChars(chars).forEach((param) => {
    const text = `test { ${param} } param`;
    it(`works with: ${text}`, () => {
      const params = { [param]: 'valid' };
      expectToThrow(text, ERROR_UNEXPECTED_CHAR, params);
    });
  });
}

describe('simple formatter', () => {
  test('test test', () => {
    expect(getText()).toEqual('test test');
  });

  test('simple test', () => {
    matchIcu();
  });

  test('this is {name}', () => {
    matchIcu({ name: 'Bob' });
  });

  test('this is {  name  }', () => {
    matchIcu({ name: 'Bob' });
  });

  test('{ user } has { num } apples.', () => {
    matchIcu({ user: 'John', num: 2 });
  });

  test('passing params, but no params here', () => {
    matchIcu({ user: 'John', num: 2 });
  });

  test('{ user } has { user } apples.', () => {
    matchIcu({ user: 'John', num: 2 });
  });

  test("ICU: '{ parameter '} format", () => {
    matchIcu();
  });

  test("this '{ escaped }' well", () => {
    matchIcu();
  });

  test("this is '{ weird } but valid", () => {
    matchIcu();
  });

  test("edge case '", () => {
    matchIcu();
  });

  test("What's {subject}?", () => {
    matchIcu({ subject: 'that' });
  });

  test('this is also } right', () => {
    matchIcu();
  });

  test('this is just {} wrong', () => {
    expectToThrowWithIcu(ERROR_PARAM_EMPTY);
  });

  test('this also { } wrong', () => {
    expectToThrowWithIcu(ERROR_PARAM_EMPTY);
  });

  test('this plain { , } wrong', () => {
    expectToThrowWithIcu(ERROR_UNEXPECTED_CHAR);
  });

  test('this is { unexpected', () => {
    expectToThrowWithIcu(ERROR_UNEXPECTED_END);
  });

  test('this is obviously bad { yo yo }', () => {
    expectToThrowWithIcu(ERROR_UNEXPECTED_CHAR);
  });

  test('this is obviously bad { yo, }', () => {
    expectToThrowWithIcu(ERROR_UNEXPECTED_CHAR);
  });

  test('good for icu { yo, number } not for me', () => {
    unsupported(ERROR_UNEXPECTED_CHAR, { yo: 6 });
  });

  describe('supported characters in params', () => {
    characterInParamSupported(Array.from('019_axAX'));
  });

  describe('invalid characters in params', () => {
    characterInParamFailWithIcu('[+-@#$~^&*{%)(§\'"`!?:.;<>[]\\=|☺'.split(''));
  });

  describe('unsupported characters which are supported in ICU', () => {
    characterInParamFail(Array.from('šřýíéúůĚŽÝÁÍÉůú¨ˇ'));
    characterInParamFail(['汉字', '字', 'हि', 'हिन्दी']);
    characterInParamFail(['😊']);
  });
});
