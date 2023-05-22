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

type EncodeValue = {
  // key
  k: string;
  // namespaces
  n: string | undefined;
  // default value
  d: string | undefined;
};

export function InvisibleWrapper(): WrapperMiddleware {
  // const keyMemory = ValueMemory();

  function encodeValue(data: TranslatePropsInternal) {
    const value: EncodeValue = {
      k: data.key,
      n: data.ns || undefined,
      d: data.defaultValue,
    };
    return JSON.stringify(value);
  }

  function decodeValue(value: string) {
    return JSON.parse(value || '{}') as EncodeValue;
  }

  return Object.freeze({
    unwrap(text: string): Unwrapped {
      const keysAndParams = [] as KeyAndParams[];
      const messages = decodeFromText(text);

      messages.forEach((encodedValue: string) => {
        const { k: key, d: defaultValue, n: ns } = decodeValue(encodedValue);
        keysAndParams.push({
          key,
          defaultValue,
          ns,
        });
      });

      const result = removeSecrets(text);

      return { text: result, keys: keysAndParams };
    },

    wrap({ key, defaultValue, translation, ns }) {
      const encodedValue = encodeValue({ key, ns, defaultValue });

      const value = translation || '';
      const invisibleMark = encodeMessage(encodedValue);

      return typeof value === 'string' ? value + invisibleMark : value;
    },

    getTextXPath() {
      return `./descendant-or-self::text()[contains(., '${INVISIBLE_CHARACTERS[0]}${INVISIBLE_CHARACTERS[0]}') or contains(., '${INVISIBLE_CHARACTERS[1]}${INVISIBLE_CHARACTERS[0]}')]`;
    },

    getAttributeXPath({ tag, attribute }) {
      return `descendant-or-self::${tag}/@${attribute}[contains(., '${INVISIBLE_CHARACTERS[0]}${INVISIBLE_CHARACTERS[0]}') or contains(., '${INVISIBLE_CHARACTERS[1]}${INVISIBLE_CHARACTERS[0]}')]`;
    },
  });
}
