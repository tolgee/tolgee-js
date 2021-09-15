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

  protected get resultProvider(): (input, params) => Observable<string> {
    return (input, params) => this.translateService.get(input, params);
  }

  ngOnDestroy(): void {
    this.langChangeSubscription.unsubscribe();
  }

  transform(input: any, params = {}): any {
    if (!input || input.length === 0) {
      return input;
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
        this.onLangChange(input, params);
      }
    );

    this.onLangChange(input, params);

    this.lastHash = newHash;

    return this.value;
  }

  private getHash(input: string, params: object, language: string): string {
    return JSON.stringify({ input, params, language });
  }

  private onLangChange(input, params) {
    this.resultProvider(input, params).subscribe((r) => {
      this.value = r;
    });
  }
}
