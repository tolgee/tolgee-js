import type {
  WrapperAttributeXPathGetter,
  KeyAndParams,
  Unwrapped,
  WrapperMiddleware,
  WrapperWrapFunction,
  TranslatePropsInternal,
} from '@tolgee/core';
import {
  decodeFromText,
  encodeMessage,
  INVISIBLE_CHARACTERS,
  removeSecrets,
  stringToCodePoints,
} from './secret';

import { ValueMemory } from './ValueMemory';

type EncodeValue = {
  // key
  k: string;
  // namespaces
  n: string | undefined;
  // default value
  d: string | undefined;
};

export const InvisibleWrapper = (): WrapperMiddleware => {
  const keyMemory = ValueMemory();

  const unwrap = (text: string): Unwrapped => {
    const keysAndParams = [] as KeyAndParams[];
    const messages = decodeFromText(text);

    messages.forEach((msg: string) => {
      const [valueCode] = stringToCodePoints(msg);
      const encodedValue = keyMemory.numberToValue(valueCode);
      const { k: key, d: defaultValue, n: ns } = decodeValue(encodedValue);
      keysAndParams.push({
        key,
        defaultValue,
        ns,
      });
    });

    const result = removeSecrets(text);

    return { text: result, keys: keysAndParams };
  };

  const encodeValue = (data: TranslatePropsInternal) => {
    const value: EncodeValue = {
      k: data.key,
      n: data.ns || undefined,
      d: data.defaultValue,
    };
    return JSON.stringify(value);
  };

  const decodeValue = (value: string) => {
    return JSON.parse(value || '{}') as EncodeValue;
  };

  const wrap: WrapperWrapFunction = ({
    key,
    defaultValue,
    translation,
    ns,
  }) => {
    const encodedValue = encodeValue({ key, ns, defaultValue });
    const code = keyMemory.valueToNumber(encodedValue);

    const value = translation || '';
    const invisibleMark = encodeMessage(String.fromCodePoint(code));

    return typeof value === 'string' ? value + invisibleMark : value;
  };

  const getTextXPath = () => {
    return `./descendant-or-self::text()[contains(., '${INVISIBLE_CHARACTERS[0]}${INVISIBLE_CHARACTERS[0]}') or contains(., '${INVISIBLE_CHARACTERS[1]}${INVISIBLE_CHARACTERS[0]}')]`;
  };

  const getAttributeXPath: WrapperAttributeXPathGetter = ({
    tag,
    attribute,
  }) => {
    return `descendant-or-self::${tag}/@${attribute}[contains(., '${INVISIBLE_CHARACTERS[0]}${INVISIBLE_CHARACTERS[0]}') or contains(., '${INVISIBLE_CHARACTERS[1]}${INVISIBLE_CHARACTERS[0]}')]`;
  };

  return Object.freeze({
    unwrap,
    wrap,
    getTextXPath,
    getAttributeXPath,
  });
};
