import type {
  KeyAndParams,
  Unwrapped,
  WrapperMiddleware,
  TranslatePropsInternal,
} from '@tolgee/core';

import {
  decodeFromText,
  encodeMessage,
  INVISIBLE_CHARACTERS,
  removeSecrets,
} from './secret';
import { ValueMemory } from './ValueMemory';

/**
 * LF character to separate messages (when they are right next to each other)
 *
 * We can use the fact that `\n` characters get escaped inside the JSON strings and we don't need them with numbers
 * so we can safely use newlines to separate strings
 *
 * WARNING: don't encode formatted json like this (because then there are newlines):
 * {
 *   "a": "b"
 * }
 * this is correct:
 * {"a":"b"}
 */
export const MESSAGE_END = '\x0A';

type EncodeValue = {
  // key
  k: string;
  // namespaces
  n: string | undefined;
  // default value
  d: string | undefined;
};

type Props = {
  fullKeyEncode: boolean;
};

export function InvisibleWrapper({ fullKeyEncode }: Props): WrapperMiddleware {
  const keyMemory = ValueMemory();

  function encodeValue(data: TranslatePropsInternal) {
    const value: EncodeValue = {
      k: data.key,
      n: data.ns || undefined,
      d: data.defaultValue,
    };
    return JSON.stringify(value);
  }

  function decodeValue(value: string): EncodeValue | undefined {
    try {
      return JSON.parse(value || '{}') as EncodeValue;
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      return undefined;
    }
  }

  function retrieveMessages(text: string) {
    return text
      .split(MESSAGE_END)
      .filter((m) => m.length)
      .map((message) => {
        if (message[0] === '{') {
          // there is a json inside - the full key is included, not just number `fullKeyEncode`
          return message;
        } else {
          const valueCode = Number(message);
          return keyMemory.numberToValue(valueCode);
        }
      });
  }

  function encodeWithSeparator(message: string) {
    return encodeMessage(message + MESSAGE_END);
  }

  return Object.freeze({
    unwrap(text: string): Unwrapped {
      const keysAndParams = [] as KeyAndParams[];
      const texts = decodeFromText(text);
      texts.forEach((encodedValue: string) => {
        const messages = retrieveMessages(encodedValue);
        messages.forEach((message) => {
          const decodedVal = decodeValue(message);
          if (decodedVal) {
            const { k: key, d: defaultValue, n: ns } = decodedVal;
            keysAndParams.push({
              key,
              defaultValue,
              ns,
            });
          }
        });
      });

      const result = removeSecrets(text);

      return { text: result, keys: keysAndParams };
    },

    wrap({ key, defaultValue, translation, ns }) {
      let invisibleMark: string;
      if (fullKeyEncode) {
        // don't include default value, as that might be very long when encoded
        const encodedValue = encodeValue({ key, ns });
        invisibleMark = encodeWithSeparator(encodedValue);
      } else {
        const encodedValue = encodeValue({ key, ns, defaultValue });
        const code = keyMemory.valueToNumber(encodedValue);
        invisibleMark = encodeWithSeparator(String(code));
      }

      const value = translation || '';

      return typeof value === 'string' ? value + invisibleMark : value;
    },

    testTextNode(textNode: Text) {
      return (
        (textNode.textContent?.includes(
          `${INVISIBLE_CHARACTERS[0]}${INVISIBLE_CHARACTERS[0]}`
        ) ||
          textNode.textContent?.includes(
            `${INVISIBLE_CHARACTERS[1]}${INVISIBLE_CHARACTERS[0]}`
          )) ??
        false
      );
    },

    testAttribute(attribute: Attr) {
      return (
        attribute.value.includes(
          `${INVISIBLE_CHARACTERS[0]}${INVISIBLE_CHARACTERS[0]}`
        ) ||
        attribute.value.includes(
          `${INVISIBLE_CHARACTERS[1]}${INVISIBLE_CHARACTERS[0]}`
        )
      );
    },
  });
}
