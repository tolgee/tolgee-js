import { OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from './translate.service';
import { Observable, Subscription } from 'rxjs';

@Pipe({
  name: 'translate',
  pure: false,
})
export class TranslatePipe implements PipeTransform, OnDestroy {
  value = '';
  key: string;
  params: Record<string, any>;
  defaultValue: string;
  private;
  private subscription: Subscription;

  constructor(protected translateService: TranslateService) {}

  protected get resultProvider(): (
    key,
    params,
    defaultValue: string
  ) => Observable<string> {
    return (key, params, defaultValue) =>
      this.translateService.get(key, params, defaultValue);
  }

  ngOnDestroy(): void {
    this.unsubscribe();
  }

  transform(key: any, params?: Record<string, any>): string;

  transform(
    key: any,
    defaultValue?: string,
    params?: Record<string, any>
  ): string;

  transform(
    key: any,
    paramsOrDefaultValue?: Record<string, any> | string,
    params?: Record<string, any>
  ): string {
    if (!key || key.length === 0) {
      return key;
    }

    const defaultValue =
      typeof paramsOrDefaultValue !== 'object'
        ? paramsOrDefaultValue
        : undefined;

    if (typeof paramsOrDefaultValue === 'object') {
      params = paramsOrDefaultValue;
    }

    if (
      this.key === key &&
      JSON.stringify(this.params) === JSON.stringify(params) &&
      this.defaultValue === defaultValue
    ) {
      return this.value;
    }

    this.key = key;
    this.params = params;
    this.defaultValue = defaultValue;

    // unsubscribe first
    this.unsubscribe();

    // asynchronously translate and assign subscription
    this.subscription = this.translate(key, params, defaultValue);

    return this.value;
  }

  private unsubscribe() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private translate(key, params, defaultValue) {
    return this.resultProvider(key, params, defaultValue).subscribe((r) => {
      this.value = r;
    });
  }
}
