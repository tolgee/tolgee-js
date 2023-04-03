import { ChangeDetectorRef, OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from './translate.service';
import { Subscription } from 'rxjs';
import { getTranslateProps, TFnType, TranslateProps } from '@tolgee/web';

@Pipe({
  name: 'translate',
  pure: false,
})
export class TranslatePipe implements PipeTransform, OnDestroy {
  private value = '';
  private previousHash: string;

  private subscription: Subscription;

  constructor(protected translateService: TranslateService, private _cdr: ChangeDetectorRef) {}

  ngOnDestroy(): void {
    this.unsubscribe();
  }

  readonly transform: TFnType<string> = (...args) => {
    // @ts-ignore
    const params = getTranslateProps(...args);
    const { key } = params;

    if (!key || key.length === 0) {
      return key;
    }

    const newHash = this.hash(params);
    if (this.previousHash === newHash) {
      return this.value;
    }

    this.previousHash = newHash;

    this.translate(params);

    return this.value;
  };

  private hash(props: TranslateProps) {
    return JSON.stringify([props, this.translateService.tolgee.getLanguage()]);
  }

  private unsubscribe() {
    this.subscription?.unsubscribe();
    this.subscription = null;
  }

  private translate(props: TranslateProps) {
    this.value = this.translateService.instant({ ...props, orEmpty: true });
    this.subscribe(props);
  }

  private subscribe(props: TranslateProps) {
    this.unsubscribe();
    this.subscription = this.translateService.translate(props).subscribe((r) => {
      this.value = r;
      this._cdr.markForCheck();
    });
  }
}
