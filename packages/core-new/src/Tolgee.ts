import { InstantProps } from '.';
import { TolgeeConfig } from './TolgeeConfig';
import { TolgeeInternal, TolgeeInternalImplementation } from './TolgeeInternal';
import {
  InstantPropsTags,
  Subscription,
  TolgeeInstant,
  TolgeeModule,
  TolgeeTranslate,
  TolgeeWrap,
  TranslatePropsTags,
  TranslationParams,
  TranslationParamsTags,
  Translations,
  TranslationTags,
} from './types';

export class Tolgee {
  private internal: TolgeeInternalImplementation | undefined = undefined;

  public get lang(): string {
    return '';
  }

  public get defaultLanguage() {
    return '';
  }

  public get onLangChange(): Subscription {
    return null as any as Subscription;
  }

  public get onTranslationChange() {
    return null as any as Subscription;
  }

  /**
   * Is emitted when language is loaded for the first time
   */
  public get onLangLoaded() {
    return null as any as Subscription;
  }

  /**
   * True if loading is needed to wait for Tolgee init.
   * When translation data are provided statically (using import
   * as staticData config property) then there is no need for translation
   * fetching so initial loading is not needed at all.
   */
  get initialLoading(): boolean {
    return null as any as boolean;
  }

  static use(module: TolgeeModule) {
    return new Tolgee().use(module);
  }

  static init(config: TolgeeConfig) {
    return new Tolgee().init(config);
  }

  static createInstance() {
    return new Tolgee();
  }

  /**
   * Sets the new language.
   *
   * Emits the onLangChange and onLangChangeAndLoad events after
   * the translations are loaded.
   *
   * @return Promise<void> Resolves when translations are loaded
   */
  public async changeLanguage(newLanguage: string): Promise<void> {
    return Promise.resolve();
  }

  use(module: TolgeeModule) {
    return this;
  }

  init(config: TolgeeConfig) {
    this.internal = TolgeeInternal(config);
    return this;
  }

  public async run(): Promise<void> {
    this.internal!.run();
  }

  public async refresh() {
    return Promise.resolve();
  }

  translate: TolgeeTranslate = async (
    keyOrProps: string | TranslatePropsTags<any>,
    params: TranslationParamsTags<any> = {},
    noWrap = false,
    defaultValue: string | undefined = undefined
  ) => {
    return Promise.resolve('');
  };

  wrap: TolgeeWrap = (
    key: string,
    params?: any,
    defaultValue?: string | undefined,
    translation?: TranslationTags<any>
  ) => {
    return '';
  };

  instant = ((
    keyOrProps: string | InstantProps | InstantPropsTags<any>,
    params: TranslationParams = {},
    noWrap = false,
    orEmpty?: boolean,
    defaultValue?: string
  ) => {
    return '';
  }) as TolgeeInstant;

  /**
   * Get currently cached translations for all languages
   */
  public getCachedTranslations() {
    return new Map<string, Translations>();
  }

  /**
   * Loads translations for given language or returns them from cache
   * @returns Loaded translations
   */
  public loadTranslations(language: string, scope = '') {
    return this.internal!.loadTranslations(language, scope);
  }

  public stop = () => {
    this.internal!.stop();
  };
}
