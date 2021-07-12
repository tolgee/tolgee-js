import { Lifecycle, scoped } from 'tsyringe';
import {
  KeyAndParams,
  TranslatedWithMetadata,
  TranslationParams,
} from '../types';
import { TranslationService } from './TranslationService';
import { Properties } from '../Properties';
import { TextHelper } from '../helpers/TextHelper';
import IntlMessageFormat from 'intl-messageformat';

export type ReplacedType = { text: string; keys: KeyAndParams[] };

@scoped(Lifecycle.ContainerScoped)
export class TextService {
  constructor(
    private properties: Properties,
    private translationService: TranslationService
  ) {}

  async translate(
    key: string,
    params: TranslationParams,
    lang = this.properties.currentLanguage,
    orEmpty?
  ) {
    return this.format(
      await this.translationService.getTranslation(key, lang, orEmpty),
      params
    );
  }

  instant(
    key: string,
    params: TranslationParams,
    lang = this.properties.currentLanguage,
    orEmpty?
  ) {
    return this.format(
      this.translationService.getFromCacheOrFallback(key, lang, orEmpty),
      params
    );
  }

  async replace(text: string): Promise<ReplacedType> {
    const matchRegexp = new RegExp(this.rawUnWrapRegex, 'gs');

    const keysAndParams: KeyAndParams[] = [];

    let matched = false;

    let match;
    let start = 0;
    let result = '';
    while ((match = matchRegexp.exec(text)) !== null) {
      const [fullMatch, pre, wrapped, unwrapped] = match as [
        string,
        string,
        string,
        string
      ];
      const { index, input } = match;
      result += input.substr(start, index - start);
      start = index + fullMatch.length;
      if (pre === '\\' && !TextHelper.isCharEscaped(index, text)) {
        result += wrapped;
        continue;
      }
      const translated = await this.getTranslatedWithMetadata(unwrapped);
      keysAndParams.push({ key: translated.key, params: translated.params });
      matched = true;
      result += pre + translated.translated;
    }

    result += text.substring(start);

    const withoutEscapes = TextHelper.removeEscapes(result);

    if (matched) {
      return { text: withoutEscapes, keys: keysAndParams };
    }

    return undefined;
  }

  public wrap(key: string, params: TranslationParams = {}): string {
    let paramString = Object.entries(params)
      .map(
        ([name, value]) =>
          `${this.escapeParam(name)}:${this.escapeParam(value as string)}`
      )
      .join(',');
    paramString = paramString.length ? `:${paramString}` : '';
    return `${this.properties.config.inputPrefix}${this.escapeParam(
      key
    )}${paramString}${this.properties.config.inputSuffix}`;
  }

  private async getTranslatedWithMetadata(
    text: string
  ): Promise<TranslatedWithMetadata> {
    const { key, params } = TextService.parseUnwrapped(text);
    const translated = await this.translate(key, params, undefined, false);
    return { translated, key: key, params };
  }

  private static parseUnwrapped(unWrappedString: string): KeyAndParams {
    const strings = unWrappedString.match(/(?:[^\\,:\n]|\\.)+/g);
    const result = {
      key: TextHelper.removeEscapes(strings.shift()),
      params: {},
    };

    while (strings.length) {
      const [name, value] = strings.splice(0, 2);
      result.params[name] = value;
    }
    return result;
  }

  private readonly format = (
    translation: string,
    params: TranslationParams
  ): string => {
    try {
      return new IntlMessageFormat(
        translation,
        this.properties.currentLanguage
      ).format(params) as string;
    } catch (e) {
      if (e.code === 'MISSING_VALUE') {
        // eslint-disable-next-line no-console
        console.warn(e.message);
        return translation;
      }
    }
  };

  private readonly escapeForRegExp = (string: string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  };

  private get rawUnWrapRegex(): string {
    const escapedPrefix = this.escapeForRegExp(
      this.properties.config.inputPrefix
    );
    const escapedSuffix = this.escapeForRegExp(
      this.properties.config.inputSuffix
    );
    return `(\\\\?)(${escapedPrefix}(.*?)${escapedSuffix})`;
  }

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
