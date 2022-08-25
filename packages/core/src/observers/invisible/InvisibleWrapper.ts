import { KeyAndParams, WrapperPlugin } from '../../types';
import {
  decodeFromText,
  encodeMessage,
  removeSecrets,
  stringToCodePoints,
} from './secret';

import { ValueMemory } from './ValueMemory';

export const InvisibleWrapper: WrapperPlugin = () => {
  const keyMemory = new ValueMemory();
  const defaultMemory = new ValueMemory();

  const unwrap = (text: string) => {
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

  const wrap = (
    key: string,
    translation: string,
    _params: Record<string, any> = {},
    defaultValue: string | undefined = undefined
  ) => {
    const codes = [keyMemory.valueToNumber(key)];
    if (defaultValue) {
      codes.push(defaultMemory.valueToNumber(defaultValue));
    }

    const value = translation || '';
    const invisibleMark = encodeMessage(String.fromCodePoint(...codes));

    return typeof value === 'string' ? value + invisibleMark : value;
  };

  return Object.freeze({
    unwrap,
    wrap,
  });
};
