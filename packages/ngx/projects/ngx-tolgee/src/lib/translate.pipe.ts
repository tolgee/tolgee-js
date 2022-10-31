import { OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from './translate.service';
import { Subscription } from 'rxjs';
import { getTranslateParams, TFnType, TranslateProps } from '@tolgee/web';

@Pipe({
  name: 'translate',
  pure: false,
})
export class TranslatePipe implements PipeTransform, OnDestroy {
  value = '';
  params: any;

  private subscription: Subscription;

  constructor(protected translateService: TranslateService) {}

  ngOnDestroy(): void {
    this.unsubscribe();
  }

  readonly transform: TFnType = (...args) => {
    // @ts-ignore
    const params = getTranslateParams(...args);
    const { key } = params;

    if (!key || key.length === 0) {
      return key;
    }

    if (JSON.stringify(this.params) === JSON.stringify(params)) {
      return this.value;
    }

    this.params = params;

    // unsubscribe first
    this.unsubscribe();

    // asynchronously translate and assign subscription
    this.subscription = this.translate(params);

    return this.value;
  };

  private unsubscribe() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private translate(props: TranslateProps) {
    return this.translateService.translate(props).subscribe((r) => {
      this.value = r;
    });
  }
}
