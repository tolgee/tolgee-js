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
  @Input() params: Record<string, any>;
  @Input() key: string;
  onLangChangeSubscription: Subscription;
  onTranslationChangeSubscription: Subscription;

  constructor(
    private ref: ElementRef,
    private translateService: TranslateService
  ) {}

  protected get resultProvider(): (input, params) => Observable<string> {
    return (input, params) => this.translateService.getSafe(input, params);
  }

  ngOnInit(): void {
    this.ref.nativeElement.setAttribute(
      TOLGEE_WRAPPED_ONLY_DATA_ATTRIBUTE,
      this.key
    );

    //update value when language changed
    this.onLangChangeSubscription =
      this.translateService.onLangChange.subscribe(() => {
        this.translate(this.key, this.params);
      });

    //update value when translation changed
    this.onTranslationChangeSubscription =
      this.translateService.onTranslationChange.subscribe((data) => {
        if (data.key == this.key) {
          this.translate(this.key, this.params);
        }
      });
    this.translate(this.key, this.params);
  }

  ngOnDestroy(): void {
    this.onLangChangeSubscription?.unsubscribe();
    this.onTranslationChangeSubscription?.unsubscribe();
  }

  private translate(input, params) {
    this.resultProvider(input, params).subscribe((r) => {
      this.ref.nativeElement.innerHTML = r;
    });
  }
}
