import { Encoder, Decoder } from './encoderPolyfill';

export const INVISIBLE_CHARACTERS = ['\u200C', '\u200D'];

export const INVISIBLE_REGEX = RegExp(
  `([${INVISIBLE_CHARACTERS.join('')}]{9})+`,
  'gu'
);

const toBytes = (text: string) => {
  return Array.from(new Encoder().encode(text));
};

const fromBytes = (bytes) => {
  return new Decoder().decode(new Uint8Array(bytes));
};

const padToWholeBytes = (binary: string) => {
  const needsToAdd = 8 - binary.length;
  return '0'.repeat(needsToAdd) + binary;
};

export const encodeMessage = (text: string) => {
  const bytes = toBytes(text).map(Number);
  const binary = bytes
    .map((byte) => padToWholeBytes(byte.toString(2)) + '0')
    .join('');

  const result = Array.from(binary)
    .map((b) => INVISIBLE_CHARACTERS[Number(b)])
    .join('');

  return result;
};

const decodeMessage = (message: string) => {
  const binary = Array.from(message)
    .map((character) => {
      return INVISIBLE_CHARACTERS.indexOf(character);
    })
    .map(String)
    .join('');

  const textBytes = binary.match(/(.{9})/g);
  const codes = Uint8Array.from(
    textBytes.map((byte) => parseInt(byte.slice(0, 8), 2))
  );
  return fromBytes(codes);
};

export const decodeFromText = (text: string) => {
  const invisibleMessages = text
    .match(INVISIBLE_REGEX)
    ?.filter((m) => m.length > 8);
  return invisibleMessages?.map(decodeMessage) || [];
};

export const removeSecrets = (text: string) => {
  return text.replace(INVISIBLE_REGEX, '');
};

export const stringToCodePoints = (text: string) => {
  const result: number[] = [];
  for (const codePoint of text) {
    result.push(codePoint.codePointAt(0));
  }
  return result;
};
