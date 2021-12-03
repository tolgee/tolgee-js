jest.disableAutomock();

import {
  decodeFromText,
  encodeMessage,
  INVISIBLE_CHARACTERS,
  removeSecrets,
  stringToCodePoints,
} from './secret';

describe('Invisible encoder/decoder', () => {
  it('Works with simple text', () => {
    const message = 'Tolgee' + encodeMessage('secret');
    expect(decodeFromText(message)).toEqual(['secret']);
  });

  it('Works with utf-8 text', () => {
    const message = '💩💩💩' + encodeMessage('💩💩');
    expect(decodeFromText(message)).toEqual(['💩💩']);
  });

  it('Works with joiners in text', () => {
    const message = '👩‍👩‍👦‍👦👩‍👩‍👦‍👦👩‍👩‍👦‍👦' + encodeMessage('💩💩');
    expect(decodeFromText(message)).toEqual(['💩💩']);
  });

  it('Removes secrets correctly', () => {
    const message = '👩‍👩‍👦‍👦👩‍👩‍👦‍👦👩‍👩‍👦‍👦' + encodeMessage('💩💩');
    const cleanedMessage = removeSecrets(message);
    expect(cleanedMessage).toEqual('👩‍👩‍👦‍👦👩‍👩‍👦‍👦👩‍👩‍👦‍👦');
    expect(decodeFromText(cleanedMessage)).toEqual([]);
  });

  it('works correctly with numbers', () => {
    [...Array(3)].map((_, i) => {
      const numbers = [i, i + 10, i + 100, i + 1_000, i + 10_000, i + 100_000];
      const message =
        '👩‍👩‍👦‍👦👩‍👩‍👦‍👦👩‍👩‍👦‍👦' + encodeMessage(String.fromCodePoint(...numbers));
      expect(decodeFromText(message)).toEqual([
        String.fromCodePoint(...numbers),
      ]);
    });
  });

  it('works with unicode numbers', () => {
    const message =
      '👩‍👩‍👦‍👦👩‍👩‍👦‍👦👩‍👩‍👦‍👦' + encodeMessage(String.fromCodePoint(10, 500_000, 1_000_000));
    const decodedString = decodeFromText(message)[0];
    expect(stringToCodePoints(decodedString)).toEqual([10, 500_000, 1_000_000]);
  });

  it('works correctly with multiple non-joiners in row', () => {
    // valid secret byte is 8 + 1 (non-joiner), so 8 should be ignored
    const originalMessage = `a${INVISIBLE_CHARACTERS[0].repeat(8)}bcd`;
    const message = originalMessage + encodeMessage('💩💩');
    const cleanedMessage = removeSecrets(message);
    expect(decodeFromText(message)).toEqual(['💩💩']);
    expect(decodeFromText(cleanedMessage)).toEqual([]);
    expect(cleanedMessage).toEqual(originalMessage);
  });
});
