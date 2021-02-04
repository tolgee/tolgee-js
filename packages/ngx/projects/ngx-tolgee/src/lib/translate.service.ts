import {EventEmitter, Injectable} from '@angular/core';
import {from, Observable} from 'rxjs';
import {Tolgee} from "@tolgee/core";
import {TolgeeConfig} from "./tolgeeConfig";

@Injectable()
export class TranslateService {

  constructor(private config: TolgeeConfig) {
  }

  public readonly onLangChange: EventEmitter<never> = new EventEmitter<never>();

  private _tolgee: Tolgee;
  private runPromise: Promise<void>;
  private currentLanguage: string;

  public get tolgee(): Tolgee {
    return this._tolgee;
  }

  public async start(config: TolgeeConfig): Promise<void> {
    if (!this.runPromise) {
      this._tolgee = new Tolgee(config);
      this.runPromise = this.tolgee.run();
    }
    await this.runPromise;
  }

  public setLang(lang: string) {
    this.currentLanguage = lang;
    this.onLangChange.emit();
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

  public getDefaultLang(): string {
    return this.tolgee.defaultLanguage;
  }

  public getCurrentLang(): string {
    return this.tolgee.lang;
  }

  private async translate(input: string, params = {}, noWrap = false): Promise<string> {
    await this.start(this.config);
    return await this.tolgee.translate(input, params, noWrap);
  }
}
