jest.disableAutomock();

import {
  decodeFromText,
  encodeMessage,
  INVISIBLE_CHARACTERS,
  removeSecrets,
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

  it('works correctly with multiple non-joiners in row', () => {
    // valid secret byte is 8 + 1 (non-joiner), so 8 should be ignored
    const originalMessage = `a${INVISIBLE_CHARACTERS[0].repeat(8)}bcd`;
    const message = originalMessage + encodeMessage('💩💩');
    const cleanedMessage = removeSecrets(message);
    expect(decodeFromText(message)).toEqual(['💩💩']);
    expect(decodeFromText(cleanedMessage)).toEqual([]);
    expect(cleanedMessage).toEqual(originalMessage);
  });

  it('works with two messages right next to each other (merges them into one)', () => {
    const message =
      'Tolgee' + encodeMessage('secret1') + encodeMessage('secret2');
    expect(decodeFromText(message)).toEqual(['secret1secret2']);
  });

  it('works with two messages spaced with regular text', () => {
    const message =
      'Tolgee' + encodeMessage('secret1') + 'test' + encodeMessage('secret2');
    expect(decodeFromText(message)).toEqual(['secret1', 'secret2']);
  });
});
