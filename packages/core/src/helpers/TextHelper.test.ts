jest.dontMock('./TextHelper');

import { TextHelper } from './TextHelper';

describe('TextHelper', () => {
  describe('will split', () => {
    test('on non escaped properly', () => {
      const strings = TextHelper.splitOnNonEscapedDelimiter(
        'text.to.split',
        '.'
      );
      expect(strings).toEqual(['text', 'to', 'split']);
    });

    test('on escaped and non escaped properly', () => {
      const strings = TextHelper.splitOnNonEscapedDelimiter(
        'text\\.to\\.split',
        '.'
      );
      expect(strings).toEqual(['text.to.split']);
    });

    test('empty string properly', () => {
      const strings = TextHelper.splitOnNonEscapedDelimiter('', '.');
      expect(strings).toEqual(['']);
    });

    test('correctly when it begins with escape', async () => {
      const strings = TextHelper.splitOnNonEscapedDelimiter('\\.aa', '.');
      expect(strings).toEqual(['.aa']);
    });

    test('correctly when it ends with escape', async () => {
      const strings = TextHelper.splitOnNonEscapedDelimiter('aa\\.', '.');
      expect(strings).toEqual(['aa.']);
    });

    test('correctly when it contains escaped escape character', async () => {
      const strings = TextHelper.splitOnNonEscapedDelimiter('aa\\\\.', '.');
      expect(strings).toEqual(['aa\\', '']);
    });

    test('correctly when it contains escaped escape character and delimiter is escaped', async () => {
      const strings = TextHelper.splitOnNonEscapedDelimiter('aa\\\\\\.', '.');
      expect(strings).toEqual(['aa\\.']);
    });
  });

  describe('It remove escapes', () => {
    test('basically', async () => {
      expect(TextHelper.removeEscapes('t\\t')).toEqual('tt');
    });

    test('not if escape character is escaped', async () => {
      expect(TextHelper.removeEscapes('\\\\')).toEqual('\\');
    });

    test('if there is escaped escaped character', async () => {
      expect(TextHelper.removeEscapes('\\\\\\')).toEqual('\\');
    });
  });
});
