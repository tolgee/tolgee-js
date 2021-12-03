import { EventEmitter, Injectable, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { IcuFormatter, Tolgee, TranslationData } from '@tolgee/core';
import { TolgeeConfig } from './tolgeeConfig';

@Injectable()
export class TranslateService implements OnDestroy {
  public readonly onLangChange: EventEmitter<never> = new EventEmitter<never>();
  public readonly onTranslationChange: EventEmitter<TranslationData> =
    new EventEmitter<TranslationData>();

  private runPromise: Promise<void>;
  private onTranslationChangeCoreSubscription: any;
  private onLangChangeCoreSubscription: any;

  constructor(private config: TolgeeConfig) {}

  private _tolgee: Tolgee;

  public get tolgee(): Tolgee {
    return this._tolgee;
  }

  /**
   * Starts Tolgee if not started and subscribes for languageChange and translationChange events
   */
  public async start(config: TolgeeConfig): Promise<void> {
    if (!this.runPromise) {
      this._tolgee = Tolgee.use(IcuFormatter).init(config);
      this.runPromise = this.tolgee.run();
      // unsubscribe first, if it is subscribed for some reason
      this.unsubscribeCoreListeners();
      this.onTranslationChangeCoreSubscription =
        this._tolgee.onTranslationChange.subscribe((data) => {
          this.onTranslationChange.emit(data);
        });
      this.onLangChangeCoreSubscription = this._tolgee.onLangChange.subscribe(
        () => {
          this.onLangChange.emit();
        }
      );
    }
    await this.runPromise;
  }

  ngOnDestroy(): void {
    // stop it!
    this.tolgee.stop();
    // unsubscribe listeners
    this.unsubscribeCoreListeners();
  }

  /**
   * Changes the current language
   * @param lang The new current language (e.g. en, en-US)
   */
  public setLang(lang: string) {
    this.tolgee.lang = lang;
  }

  /**
   * Returns the current language
   */
  public getCurrentLang(): string {
    return this.tolgee.lang;
  }

  /**
   * Returns Observable providing current translated value
   * Tne observable is subscribed to translation change and language change events of Tolgee
   *
   * In development mode, it returns string wrapped with configured
   * prefix and suffix to be handled in browser by MutationObserver.
   *
   * You should use unsubscribe method when you are done!
   *
   * in onInit: this.subscription = translateService.get('aa')
   * in onDestroy: this.subscription.unsubscribe()
   *
   * @param key The key to translate (e.g. what-a-key)
   * @param params The parameters to interpolate (e.g. {name: "John"})
   * @param defaultValue Value, which will be rendered, when no translated value is provided
   */
  public get(
    key: string,
    params = {},
    defaultValue?: string
  ): Observable<string> {
    return this.translate(key, params, false, defaultValue);
  }

  /**
   * Returns Observable providing current translated value
   * Tne observable is subscribed to translation change and language change events of Tolgee
   *
   * In development mode, it returns the translated string,
   * so in-context localization is not going to work.
   *
   * You should use unsubscribe method when you are done!
   *
   * in onInit: this.subscription = translateService.get('aa')
   * in onDestroy: this.subscription.unsubscribe()
   *
   * @param key The key to translate (e.g. what-a-key)
   * @param params The parameters to interpolate (e.g. {name: "John"})
   * @param defaultValue Value, which will be rendered, when no translated value is provided
   */
  public getSafe(
    key: string,
    params = {},
    defaultValue?: string
  ): Observable<string> {
    return this.translate(key, params, true, defaultValue);
  }

  /**
   * Returns the translation value synchronously
   *
   * In development mode, it returns string wrapped with configured
   * prefix and suffix to be handled in browser by MutationObserver.
   *
   * @param key The key to translate (e.g. what-a-key)
   * @param params The parameters to interpolate (e.g. {name: "John"})
   * @param defaultValue Value, which will be rendered, when no translated value is provided
   */
  public instant(key: string, params = {}, defaultValue?: string): string {
    return this.tolgee.instant(key, params, undefined, undefined, defaultValue);
  }

  /**
   * Returns the translation value synchronously
   *
   * In development mode, it returns the translated string,
   * so in-context localization is not going to work.
   *
   * @param key The key to translate (e.g. what-a-key)
   * @param params The parameters to interpolate (e.g. {name: "John"})
   * @param defaultValue Value, which will be rendered, when no translated value is provided
   */
  public instantSafe(
    input: string,
    params = {},
    defaultValue?: string
  ): string {
    return this.tolgee.instant(input, params, true, undefined, defaultValue);
  }

  private unsubscribeCoreListeners() {
    this.onTranslationChangeCoreSubscription?.unsubscribe();
    this.onLangChangeCoreSubscription?.unsubscribe();
  }

  private translate(
    key: string,
    params = {},
    noWrap = false,
    defaultValue: string
  ): Observable<string> {
    return new Observable((subscriber) => {
      const translate = async () => {
        // start if not started
        await this.start(this.config);
        const translated = await this.tolgee.translate(
          key,
          params,
          noWrap,
          defaultValue
        );

        subscriber.next(translated);
      };

      translate();

      const onTranslationChangeSubscription =
        this.tolgee.onTranslationChange.subscribe((data) => {
          if (data.key === key) {
            translate();
          }
        });

      const onLanguageChangeSubscription = this.tolgee.onLangChange.subscribe(
        () => {
          translate();
        }
      );

      return () => {
        onTranslationChangeSubscription.unsubscribe();
        onLanguageChangeSubscription.unsubscribe();
      };
    });
  }
}
