import { KeyAndParams, TranslatedWithMetadata } from '../types';
import { TranslationService } from './TranslationService';
import { Properties } from '../Properties';
import { decodeFromText, INVISIBLE_REGEX } from 'helpers/secret';

export type ReplacedType = { text: string; keys: KeyAndParams[] };

export class InvisibleTextService {
  constructor(
    private properties: Properties,
    private translationService: TranslationService
  ) {}

  async replace(text: string): Promise<ReplacedType> {
    const keysAndParams = [] as KeyAndParams[];
    const keys = decodeFromText(text);

    keys.forEach((key) => {
      keysAndParams.push({
        key: key,
        params: undefined,
        defaultValue: undefined,
      });
    });

    const result = text.replace(INVISIBLE_REGEX, '');

    if (keys.length) {
      return { text: result, keys: keysAndParams };
    }
    return undefined;
  }
}
