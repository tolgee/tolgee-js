import { TolgeeConfig } from './TolgeeConfig';
import { InstantProps, TranslateProps, TranslationParams } from './types';
import { NodeHelper } from './helpers/NodeHelper';
import { EventEmitterImpl } from './services/EventEmitter';
import { DependencyStore } from './services/DependencyStore';

export class Tolgee {
  private dependencyStore: DependencyStore;

  constructor(config: TolgeeConfig) {
    this.dependencyStore = new DependencyStore(new TolgeeConfig(config));
  }

  get properties() {
    return this.dependencyStore.properties;
  }

  get translationService() {
    return this.dependencyStore.translationService;
  }

  get coreService() {
    return this.dependencyStore.coreService;
  }

  public get lang() {
    return this.properties.currentLanguage;
  }

  public set lang(value) {
    this.properties.currentLanguage = value;
    (
      this.dependencyStore.eventService
        .LANGUAGE_CHANGED as EventEmitterImpl<any>
    ).emit(value);
  }

  public get defaultLanguage() {
    return this.properties.config.defaultLanguage;
  }

  public get onLangChange() {
    return this.dependencyStore.eventService.LANGUAGE_CHANGED;
  }

  public get onTranslationChange() {
    return this.dependencyStore.eventService.TRANSLATION_CHANGED;
  }

  public get onLangLoaded() {
    return this.dependencyStore.eventService.LANGUAGE_LOADED;
  }

  /**
   * True if loading is needed to wait for Tolgee init.
   * When translation data are provided statically (using import
   * as staticData config property) then there is no need for translation
   * fetching so initial loading is not needed at all.
   */
  get initialLoading(): boolean {
    if (this.properties?.config?.mode !== 'production') {
      return true;
    }

    const currentLang = this.properties.currentLanguage;
    const fallbackLang = this.properties.config.fallbackLanguage;
    const fallbackPreloading = this.properties.config.preloadFallback;
    const isStaticDataProvided = (data?: any) => {
      return data !== undefined && typeof data !== 'function';
    };

    return (
      !isStaticDataProvided(this.properties.config.staticData?.[currentLang]) ||
      (!!fallbackPreloading &&
        !isStaticDataProvided(
          this.properties.config.staticData?.[fallbackLang]
        ))
    );
  }

  public async run(): Promise<void> {
    if (this.properties.config.mode === 'development') {
      await this.loadScopes();
    }

    await this.translationService.loadTranslations();
    await this.dependencyStore.pluginManager.run();

    if (this.properties.config.preloadFallback) {
      await this.translationService.loadTranslations(
        this.properties.config.fallbackLanguage
      );
    }

    await this.refresh();

    if (this.properties.config.watch) {
      this.dependencyStore.observer.observe();
    }
  }

  public async refresh() {
    return this.dependencyStore.coreHandler.handleSubtree(
      this.properties.config.targetElement
    );
  }

  async translate(props: TranslateProps): Promise<string>;
  async translate(
    key: string,
    params: TranslationParams,
    noWrap?: boolean,
    defaultValue?: string
  ): Promise<string>;

  async translate(
    keyOrProps: string | TranslateProps,
    params: TranslationParams = {},
    noWrap = false,
    defaultValue: string | undefined = undefined
  ): Promise<string> {
    const key = typeof keyOrProps === 'string' ? keyOrProps : keyOrProps.key;
    if (typeof keyOrProps === 'object') {
      const props = keyOrProps as TranslateProps;
      // if values are not provided in props object, get them from function
      // params defaults
      params = props.params !== undefined ? props.params : params;
      noWrap = props.noWrap !== undefined ? props.noWrap : noWrap;
      defaultValue =
        props.defaultValue !== undefined ? props.defaultValue : defaultValue;
    }

    if (this.properties.config.mode === 'development' && !noWrap) {
      await this.loadScopes();
      await this.translationService.loadTranslations();
      return this.dependencyStore.textService.wrap(key, params, defaultValue);
    }
    return this.dependencyStore.textService.translate(
      key,
      params,
      undefined,
      undefined,
      defaultValue
    );
  }

  instant(
    key: string,
    params?: TranslationParams,
    noWrap?: boolean,
    orEmpty?: boolean,
    defaultValue?: string
  ): string;

  instant(props: InstantProps): string;

  instant(
    keyOrProps: string | InstantProps,
    params: TranslationParams = {},
    noWrap = false,
    orEmpty?: boolean,
    defaultValue?: string
  ): string {
    const key = typeof keyOrProps === 'string' ? keyOrProps : keyOrProps.key;
    if (typeof keyOrProps === 'object') {
      const props = keyOrProps as InstantProps;
      // if values are not provided in props object, get them from function
      // params defaults
      params = props.params !== undefined ? props.params : params;
      noWrap = props.noWrap !== undefined ? props.noWrap : noWrap;
      defaultValue =
        props.defaultValue !== undefined ? props.defaultValue : defaultValue;
      orEmpty = props.orEmpty !== undefined ? props.orEmpty : orEmpty;
    }

    if (this.properties.config.mode === 'development' && !noWrap) {
      return this.dependencyStore.textService.wrap(key, params, defaultValue);
    }
    return this.dependencyStore.textService.instant(
      key,
      params,
      undefined,
      orEmpty,
      defaultValue
    );
  }

  public stop = () => {
    this.dependencyStore.observer.stopObserving();
    this.dependencyStore.elementRegistrar.cleanAll();
    NodeHelper.unmarkElementAsTargetElement(
      this.properties.config.targetElement
    );
  };

  private async loadScopes() {
    if (this.properties.scopes === undefined) {
      this.properties.scopes =
        await this.dependencyStore.coreService.getScopes();
    }
  }
}

export default Tolgee;
