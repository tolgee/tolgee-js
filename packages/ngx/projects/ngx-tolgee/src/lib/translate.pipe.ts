import { OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from './translate.service';
import { Observable, Subscription } from 'rxjs';

@Pipe({
  name: 'translate',
  pure: false,
})
export class TranslatePipe implements PipeTransform, OnDestroy {
  value = '';
  lastHash: string;
  private langChangeSubscription: Subscription;

  constructor(protected translateService: TranslateService) {}

  protected get resultProvider(): (
    key,
    params,
    defaultValue: string
  ) => Observable<string> {
    return (input, params, defaultValue) =>
      this.translateService.get(input, params, defaultValue);
  }

  ngOnDestroy(): void {
    this.langChangeSubscription.unsubscribe();
  }

  transform(input: any, params?: Record<string, any>): string;
  transform(
    input: any,
    defaultValue?: string,
    params?: Record<string, any>
  ): string;

  transform(
    input: any,
    paramsOrDefaultValue?: Record<string, any> | string,
    params?: Record<string, any>
  ): string {
    if (!input || input.length === 0) {
      return input;
    }

    const defaultValue =
      typeof paramsOrDefaultValue !== 'object'
        ? paramsOrDefaultValue
        : undefined;

    if (typeof paramsOrDefaultValue === 'object') {
      params = paramsOrDefaultValue;
    }

    const newHash = this.getHash(
      input,
      params,
      this.translateService.getCurrentLang()
    );

    if (newHash === this.lastHash) {
      return this.value;
    }

    this.langChangeSubscription?.unsubscribe();
    this.langChangeSubscription = this.translateService.onLangChange.subscribe(
      () => {
        this.onLangChange(input, params, defaultValue);
      }
    );

    this.onLangChange(input, params, defaultValue);

    this.lastHash = newHash;

    return this.value;
  }

  private getHash(input: string, params: object, language: string): string {
    return JSON.stringify({ input, params, language });
  }

  private onLangChange(input, params, defaultValue) {
    this.resultProvider(input, params, defaultValue).subscribe((r) => {
      this.value = r;
    });
  }
}
