// @ts-ignore
import * as FastTextEncoding from 'fast-text-encoding';
// make sure it's not treeshaken
// eslint-disable-next-line no-console
console.assert?.(FastTextEncoding);

const MESSAGE_END = '\x03'; // using End of Text (ETX) character to separate messages

export const INVISIBLE_CHARACTERS = ['\u200C', '\u200D'];

export const INVISIBLE_REGEX = RegExp(
  `([${INVISIBLE_CHARACTERS.join('')}]{9})+`,
  'gu'
);

function toBytes(text: string) {
  return Array.from(new TextEncoder().encode(text));
}

function fromBytes(bytes: Iterable<number>) {
  return new TextDecoder().decode(new Uint8Array(bytes));
}

function padToWholeBytes(binary: string) {
  const needsToAdd = 8 - binary.length;
  return '0'.repeat(needsToAdd) + binary;
}

export function encodeMessage(text: string) {
  // insert a message end character
  // so we can distinguish two secret messages right next to each other
  const bytes = toBytes(text + MESSAGE_END).map(Number);
  const binary = bytes
    .map((byte) => padToWholeBytes(byte.toString(2)) + '0')
    .join('');

  const result = Array.from(binary)
    .map((b) => INVISIBLE_CHARACTERS[Number(b)])
    .join('');

  return result;
}

function decodeMessage(message: string) {
  const binary = Array.from(message)
    .map((character) => {
      return INVISIBLE_CHARACTERS.indexOf(character);
    })
    .map(String)
    .join('');

  const textBytes = binary.match(/(.{9})/g);
  const codes = Uint8Array.from(
    textBytes?.map((byte) => parseInt(byte.slice(0, 8), 2)) || []
  );
  return fromBytes(codes);
}

export function decodeFromText(text: string) {
  const invisibleMessages = text
    .match(INVISIBLE_REGEX)
    ?.filter((m) => m.length > 8);
  const result = [];
  invisibleMessages?.map(decodeMessage).forEach((val) => {
    // split by message end character, which separates multiple messages
    val.split(MESSAGE_END).forEach((message) => {
      if (message.length) {
        result.push(message);
      }
    });
  });

  return result;
}

export function removeSecrets(text: string) {
  return text.replace(INVISIBLE_REGEX, '');
}
