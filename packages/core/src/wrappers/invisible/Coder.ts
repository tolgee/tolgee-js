import {
  decodeFromText,
  encodeMessage,
  removeSecrets,
  stringToCodePoints,
} from '../../helpers/secret';
import {
  KeyAndParams,
  TranslationTags,
  TranslationParamsTags,
  Unwrapped,
} from '../../types';
import { ValueMemory } from './ValueMemory';

export class Coder {
  private keyMemory = new ValueMemory();
  private defaultMemory = new ValueMemory();

  unwrap(text: string): Unwrapped {
    const keysAndParams = [] as KeyAndParams[];
    const messages = decodeFromText(text);

    messages.forEach((msg) => {
      const [keyCode, defaultCode] = stringToCodePoints(msg);
      const key = this.keyMemory.numberToValue(keyCode);
      const defaultValue =
        defaultCode !== undefined
          ? this.defaultMemory.numberToValue(defaultCode)
          : undefined;
      keysAndParams.push({
        key: key,
        params: undefined,
        defaultValue,
      });
    });

    const result = removeSecrets(text);

    if (keysAndParams.length) {
      return { text: result, keys: keysAndParams };
    }
    return undefined;
  }

  public wrap(
    key: string,
    _params: TranslationParamsTags<any> = {},
    defaultValue: string | undefined = undefined,
    translation: string | any[] | undefined = undefined
  ): TranslationTags<any> {
    const codes = [this.keyMemory.valueToNumber(key)];
    if (defaultValue) {
      codes.push(this.defaultMemory.valueToNumber(defaultValue));
    }

    const value = translation || '';
    const invisibleMark = encodeMessage(String.fromCodePoint(...codes));

    return typeof value === 'string'
      ? value + invisibleMark
      : Array.isArray(value)
      ? [...value, invisibleMark]
      : [value, invisibleMark];
  }
}
