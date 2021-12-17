import {
  decodeFromText,
  encodeMessage,
  removeSecrets,
  stringToCodePoints,
} from '../../helpers/secret';
import { KeyAndParams, TranslationParams, Unwrapped } from '../../types';
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
    _params: TranslationParams = {},
    defaultValue: string | undefined = undefined,
    translation: string | undefined = undefined
  ): string {
    const codes = [this.keyMemory.valueToNumber(key)];
    if (defaultValue) {
      codes.push(this.defaultMemory.valueToNumber(defaultValue));
    }

    return (
      (translation || defaultValue || '') +
      encodeMessage(String.fromCodePoint(...codes))
    );
  }
}
