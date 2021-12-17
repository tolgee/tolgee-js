import { TextHelper } from '../../helpers/TextHelper';
import { Properties } from '../../Properties';
import { TextService } from '../../services/TextService';
import {
  KeyAndParams,
  TranslatedWithMetadata,
  TranslationParams,
  Unwrapped,
} from '../../types';

export class Coder {
  constructor(
    private properties: Properties,
    private textService: TextService
  ) {}

  private get rawUnWrapRegex(): string {
    const escapedPrefix = this.escapeForRegExp(
      this.properties.config.inputPrefix
    );
    const escapedSuffix = this.escapeForRegExp(
      this.properties.config.inputSuffix
    );
    return `(\\\\?)(${escapedPrefix}(.*?)${escapedSuffix})`;
  }

  private static parseUnwrapped(unwrappedString: string): KeyAndParams {
    let escaped = false;
    let actual = '';
    let paramName = '';
    let readingState: 'KEY' | 'DEFAULT_VALUE' | 'PARAM_NAME' | 'PARAM_VALUE' =
      'KEY';

    const result = {
      key: '',
      params: {},
      defaultValue: undefined as string | undefined,
    } as KeyAndParams;

    for (const char of unwrappedString) {
      if (char === '\\' && !escaped) {
        escaped = true;
        continue;
      }
      if (escaped) {
        escaped = false;
        actual += char;
        continue;
      }
      if (readingState === 'KEY' && char === ',') {
        readingState = 'DEFAULT_VALUE';
        result.key = actual;
        actual = '';
        continue;
      }

      if (readingState === 'KEY' && char === ':') {
        readingState = 'PARAM_NAME';
        result.key = actual;
        actual = '';
        continue;
      }

      if (readingState === 'DEFAULT_VALUE' && char === ':') {
        readingState = 'PARAM_NAME';
        result.defaultValue = actual;
        actual = '';
        continue;
      }

      if (readingState === 'PARAM_NAME' && char === ':') {
        readingState = 'PARAM_VALUE';
        paramName = actual;
        actual = '';
        continue;
      }

      if (readingState === 'PARAM_VALUE' && char === ',') {
        readingState = 'PARAM_NAME';
        result.params[paramName] = actual;
        actual = '';
        continue;
      }
      actual += char;
    }

    if (readingState === 'KEY') {
      result.key = actual;
    }

    if (readingState === 'DEFAULT_VALUE') {
      result.defaultValue = actual;
    }

    if (readingState === 'PARAM_VALUE') {
      result.params[paramName] = actual;
    }

    return result;
  }

  unwrap(text: string): Unwrapped {
    const matchRegexp = new RegExp(this.rawUnWrapRegex, 'gs');

    const keysAndParams: KeyAndParams[] = [];

    let matched = false;

    let match;
    let start = 0;
    let result = '';
    while ((match = matchRegexp.exec(text)) !== null) {
      let pre = match[1] as string;
      const [fullMatch, _, wrapped, unwrapped] = match as [
        string,
        string,
        string,
        string
      ];
      const { index, input } = match;
      result += input.substr(start, index - start);
      start = index + fullMatch.length;
      if (pre === '\\') {
        if (!TextHelper.isCharEscaped(index, text)) {
          result += wrapped;
          continue;
        }
        pre = '';
      }
      const translated = this.getTranslatedWithMetadata(unwrapped);
      keysAndParams.push({
        key: translated.key,
        params: translated.params,
        defaultValue: translated.defaultValue,
      });
      matched = true;
      result += pre + translated.translated;
    }

    result += text.substring(start);

    if (matched) {
      return { text: result, keys: keysAndParams };
    }

    return undefined;
  }

  public wrap(
    key: string,
    params: TranslationParams = {},
    defaultValue: string | undefined = undefined
  ): string {
    let paramString = Object.entries(params)
      .map(
        ([name, value]) =>
          `${this.escapeParam(name)}:${this.escapeParam(value as string)}`
      )
      .join(',');
    paramString = paramString.length ? `:${paramString}` : '';

    const defaultString =
      defaultValue !== undefined ? `,${this.escapeParam(defaultValue)}` : '';

    return `${this.properties.config.inputPrefix}${this.escapeParam(
      key
    )}${defaultString}${paramString}${this.properties.config.inputSuffix}`;
  }

  private getTranslatedWithMetadata(text: string): TranslatedWithMetadata {
    const { key, params, defaultValue } = Coder.parseUnwrapped(text);
    const translated = this.textService.instant(
      key,
      params,
      undefined,
      false,
      defaultValue
    );
    return { translated, key, params, defaultValue };
  }

  private readonly escapeForRegExp = (string: string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  };

  private readonly escapeParam = (param: any) => {
    if (typeof param === 'string') {
      return param.replace(/[,:\\]/gs, '\\$&');
    }
    if (typeof param === 'number' || typeof param === 'bigint') {
      return param.toString();
    }
    // eslint-disable-next-line no-console
    console.warn(param);
    // eslint-disable-next-line no-console
    console.warn(
      'Unsupported value type of above param. Consider converting to string.'
    );
    return param;
  };
}
