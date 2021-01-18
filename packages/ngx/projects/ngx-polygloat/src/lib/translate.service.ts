import {EventEmitter, Injectable} from '@angular/core';
import {from, Observable} from 'rxjs';
import {Polygloat} from "@polygloat/core";
import {PolygloatConfig} from "./polygloatConfig";

@Injectable()
export class TranslateService {

  constructor(private config: PolygloatConfig) {
  }

  public readonly onLangChange: EventEmitter<never> = new EventEmitter<never>();

  private _polygloat: Polygloat;
  private runPromise: Promise<void>;
  private currentLanguage: string;

  public get polygloat(): Polygloat {
    return this._polygloat;
  }

  public async start(config: PolygloatConfig): Promise<void> {
    if (!this.runPromise) {
      this._polygloat = new Polygloat(config);
      this.runPromise = this.polygloat.run();
    }
    await this.runPromise;
  }

  public setLang(lang: string) {
    this.currentLanguage = lang;
    this.onLangChange.emit();
    this.polygloat.lang = lang;
  }

  public get(input: string, params = {}): Observable<string> {
    return from(this.translate(input, params));
  }

  public getSafe(input: string, params = {}): Observable<string> {
    return from(this.translate(input, params, true));
  }

  public instant(input: string, params = {}): string {
    return this.polygloat.instant(input, params);
  }

  public instantSafe(input: string, params = {}): string {
    return this.polygloat.instant(input, params, true);
  }

  public getDefaultLang(): string {
    return this.polygloat.defaultLanguage;
  }

  public getCurrentLang(): string {
    return this.polygloat.lang;
  }

  private async translate(input: string, params = {}, noWrap = false): Promise<string> {
    await this.start(this.config);
    return await this.polygloat.translate(input, params, noWrap);
  }
}
