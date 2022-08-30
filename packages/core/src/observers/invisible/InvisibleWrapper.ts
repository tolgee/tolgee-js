import {
  WrapperAttributeXPathGetter,
  KeyAndParams,
  Unwrapped,
  WrapperInterface,
  WrapperWrapFunction,
} from '../../types';
import {
  decodeFromText,
  encodeMessage,
  INVISIBLE_CHARACTERS,
  removeSecrets,
  stringToCodePoints,
} from './secret';

import { ValueMemory } from './ValueMemory';

export const InvisibleWrapper = (): WrapperInterface => {
  const keyMemory = new ValueMemory();
  const defaultMemory = new ValueMemory();

  const unwrap = (text: string): Unwrapped => {
    const keysAndParams = [] as KeyAndParams[];
    const messages = decodeFromText(text);

    messages.forEach((msg: string) => {
      const [keyCode, defaultCode] = stringToCodePoints(msg);
      const key = keyMemory.numberToValue(keyCode);
      const defaultValue =
        defaultCode !== undefined
          ? defaultMemory.numberToValue(defaultCode)
          : undefined;
      keysAndParams.push({
        key: key,
        params: undefined,
        defaultValue,
      });
    });

    const result = removeSecrets(text);

    return { text: result, keys: keysAndParams };
  };

  const wrap: WrapperWrapFunction = ({ key, defaultValue, translation }) => {
    const codes = [keyMemory.valueToNumber(key)];
    if (defaultValue) {
      codes.push(defaultMemory.valueToNumber(defaultValue));
    }

    const value = translation || '';
    const invisibleMark = encodeMessage(String.fromCodePoint(...codes));

    return typeof value === 'string' ? value + invisibleMark : value;
  };

  const getTextXPath = () => {
    return `./descendant-or-self::text()[contains(., '${INVISIBLE_CHARACTERS[0]}')]`;
  };

  const getAttributeXPath: WrapperAttributeXPathGetter = ({
    tag,
    attribute,
  }) => {
    return `descendant-or-self::${tag}/@${attribute}[contains(., '${INVISIBLE_CHARACTERS[0]}')]`;
  };

  return Object.freeze({
    unwrap,
    wrap,
    getTextXPath,
    getAttributeXPath,
  });
};
