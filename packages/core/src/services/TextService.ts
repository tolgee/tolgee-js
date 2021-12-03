import { TranslationParams } from '../types';
import { TranslationService } from './TranslationService';
import { Properties } from '../Properties';
import { ModuleService } from './ModuleService';

export class TextService {
  constructor(
    private properties: Properties,
    private translationService: TranslationService,
    private moduleService: ModuleService
  ) {}

  async translate(
    key: string,
    params: TranslationParams,
    lang = this.properties.currentLanguage,
    orEmpty?: boolean,
    defaultValue?: string
  ) {
    const translation = await this.translationService.getTranslation(
      key,
      lang,
      defaultValue
    );
    return this.formatTranslation(key, translation, params, lang, orEmpty);
  }

  instant(
    key: string,
    params: TranslationParams,
    lang = this.properties.currentLanguage,
    orEmpty?: boolean,
    defaultValue?: string
  ) {
    const translation = this.translationService.getFromCacheOrFallback(
      key,
      lang,
      defaultValue
    );

    return this.formatTranslation(key, translation, params, lang, orEmpty);
  }

  private formatTranslation(
    key: string,
    translation: string | undefined,
    params: TranslationParams | undefined,
    lang: string | undefined,
    orEmpty: boolean | undefined
  ) {
    if (translation !== undefined) {
      return this.format(translation, params, lang);
    }
    if (!orEmpty) {
      return key;
    }
    return '';
  }

  private readonly format = (
    translation: string,
    params: TranslationParams,
    lang: string | undefined
  ): string => {
    try {
      // try to format the text
      let result = translation;
      if (this.moduleService.formatter) {
        result = this.moduleService.formatter.format({
          translation: result,
          params,
          language: lang || this.properties.currentLanguage,
        });
      }
      return result;
    } catch (e) {
      // if string cannot be formatted, throw error
      // eslint-disable-next-line no-console
      console.error(e);
    }
  };
}
