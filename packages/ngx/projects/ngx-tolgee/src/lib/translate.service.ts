import { EventEmitter, Injectable, OnDestroy } from '@angular/core';
import { from, Observable } from 'rxjs';
import { Tolgee, TranslationData } from '@tolgee/core';
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

  public async start(config: TolgeeConfig): Promise<void> {
    if (!this.runPromise) {
      this._tolgee = new Tolgee(config);
      this.runPromise = this.tolgee.run();
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
    this.tolgee.stop();
    this.unsubscribeCoreListeners();
  }

  public setLang(lang: string) {
    this.tolgee.lang = lang;
  }

  public get(input: string, params = {}): Observable<string> {
    return from(this.translate(input, params));
  }

  public getSafe(input: string, params = {}): Observable<string> {
    return from(this.translate(input, params, true));
  }

  public instant(input: string, params = {}): string {
    return this.tolgee.instant(input, params);
  }

  public instantSafe(input: string, params = {}): string {
    return this.tolgee.instant(input, params, true);
  }

  public getCurrentLang(): string {
    return this.tolgee.lang;
  }

  private unsubscribeCoreListeners() {
    this.onTranslationChangeCoreSubscription?.unsubscribe();
    this.onLangChangeCoreSubscription?.unsubscribe();
  }

  private async translate(
    input: string,
    params = {},
    noWrap = false
  ): Promise<string> {
    //wait for start before translating
    await this.start(this.config);
    return await this.tolgee.translate(input, params, noWrap);
  }
}
