import { Component, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { TranslateService } from './translate.service';
import { TOLGEE_WRAPPED_ONLY_DATA_ATTRIBUTE } from '@tolgee/core';

@Component({
  selector: '[t]',
  template: ``,
})
export class TComponent implements OnInit, OnDestroy {
  value: string;
  @Input() params?: Record<string, any>;
  @Input() key: string;
  @Input() default?: string;
  onLangChangeSubscription: Subscription;
  onTranslationChangeSubscription: Subscription;

  constructor(
    private ref: ElementRef,
    private translateService: TranslateService
  ) {}

  protected get resultProvider(): (
    key,
    params,
    defaultValue: string
  ) => Observable<string> {
    return (key, params, defaultValue) =>
      this.translateService.getSafe(key, params, defaultValue);
  }

  ngOnInit(): void {
    const element = this.ref.nativeElement as HTMLElement;

    element.setAttribute(TOLGEE_WRAPPED_ONLY_DATA_ATTRIBUTE, this.key);

    //update value when language changed
    this.onLangChangeSubscription =
      this.translateService.onLangChange.subscribe(() => {
        this.translate(this.key, this.params, this.default);
      });

    //update value when translation changed
    this.onTranslationChangeSubscription =
      this.translateService.onTranslationChange.subscribe((data) => {
        if (data.key == this.key) {
          this.translate(this.key, this.params, this.default);
        }
      });
    this.translate(this.key, this.params, this.default);
  }

  ngOnDestroy(): void {
    this.onLangChangeSubscription?.unsubscribe();
    this.onTranslationChangeSubscription?.unsubscribe();
  }

  private translate(key, params, defaultValue: string) {
    this.resultProvider(key, params, defaultValue).subscribe((r) => {
      this.ref.nativeElement.textContent = r;
    });
  }
}
