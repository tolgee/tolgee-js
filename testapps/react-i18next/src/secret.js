import { TextEncoder, TextDecoder } from "./encoder";

const usedCharacters = ["\u200C", "\u200D"];

const allCharsRegex = RegExp(`([${usedCharacters}]+)`, "gu");

const toBytes = (text) => {
  return Array.from(new TextEncoder().encode(text));
};

const fromBytes = (bytes) => {
  return new TextDecoder().decode(new Uint8Array(bytes));
};

const padToWholeBytes = (binary) => {
  const needsToAdd = 8 - binary.length;
  return "0".repeat(needsToAdd) + binary;
};

export const encodeMessage = (text) => {
  const bytes = toBytes(text).map(Number);
  const binary = bytes
    .map((byte) => padToWholeBytes(byte.toString(2)) + "0")
    .join("");

  const result = Array.from(binary)
    .map((b) => usedCharacters[Number(b)])
    .join("");

  return result;
};

const decodeMessage = (message) => {
  const binary = Array.from(message)
    .map((character) => {
      return usedCharacters.indexOf(character);
    })
    .map(String)
    .join("");

  const textBytes = binary.match(/(.{9})/g);
  const codes = Uint8Array.from(
    textBytes.map((byte) => parseInt(byte.slice(0, 8), 2))
  );
  return fromBytes(codes);
};

export const decodeFromText = (text) => {
  const invisibleMessages = text
    .match(allCharsRegex)
    ?.filter((m) => m.length > 8);
  return invisibleMessages?.map(decodeMessage) || [];
};
