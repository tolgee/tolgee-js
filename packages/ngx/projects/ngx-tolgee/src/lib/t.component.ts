import { Component, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { TranslateService } from './translate.service';
import { TOLGEE_WRAPPED_ONLY_DATA_ATTRIBUTE } from '@tolgee/core';

@Component({
  selector: '[t]',
  template: ``,
})
export class TComponent implements OnInit, OnDestroy {
  @Input() params?: Record<string, any>;
  @Input() key: string;
  @Input() default?: string;
  subscription: Subscription;

  constructor(
    private ref: ElementRef,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    const element = this.ref.nativeElement as HTMLElement;
    element.setAttribute(TOLGEE_WRAPPED_ONLY_DATA_ATTRIBUTE, this.key);

    // set safe at first
    element.textContent = this.translateService.instantSafe(
      this.key,
      this.params,
      this.default
    );

    // then do the async translation
    this.subscription = this.translateService
      .getSafe(this.key, this.params, this.default)
      .subscribe((translated) => {
        return (element.textContent = translated);
      });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
