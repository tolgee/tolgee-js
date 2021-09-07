import { TolgeeConfig } from './TolgeeConfig';
import { TranslationParams } from './types';
import { NodeHelper } from './helpers/NodeHelper';
import { EventEmitterImpl } from './services/EventEmitter';
import { DependencyStore } from './services/DependencyStore';

export class Tolgee {
  export;
  default;
  Tolgee;
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

  translate = async (
    key: string,
    params: TranslationParams = {},
    noWrap = false
  ): Promise<string> => {
    if (this.properties.config.mode === 'development' && !noWrap) {
      await this.loadScopes();
      await this.translationService.loadTranslations();
      return this.dependencyStore.textService.wrap(key, params);
    }
    return this.dependencyStore.textService.translate(key, params);
  };

  instant = (
    key: string,
    params: TranslationParams = {},
    noWrap = false,
    orEmpty?: boolean
  ): string => {
    if (this.properties.config.mode === 'development' && !noWrap) {
      return this.dependencyStore.textService.wrap(key, params);
    }
    return this.dependencyStore.textService.instant(
      key,
      params,
      undefined,
      orEmpty
    );
  };

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
