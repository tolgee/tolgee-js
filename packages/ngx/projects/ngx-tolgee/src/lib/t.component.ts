import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SecurityContext,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { TranslateService } from './translate.service';
import { TranslateParams } from '@tolgee/web';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: '[t]',
  template: ``,
})
export class TComponent implements OnInit, OnDestroy, OnChanges {
  @Input() key: string;
  @Input() ns: string;
  @Input() params?: TranslateParams<any>;
  @Input() default?: string;
  @Input() noWrap?: boolean = false;

  /**
   * When true, innerHTML property of element is set.
   * Use only when you're sure the HTML is sanitized.
   */
  @Input() isHtml?: boolean = false;

  private subscription: Subscription;
  private initialized: boolean;

  constructor(
    private ref: ElementRef,
    private translateService: TranslateService,
    private domSanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    // noinspection JSIgnoredPromiseFromCall
    this.subscribe();
    this.renderInstantValue();
  }

  ngOnChanges(): void {
    // noinspection JSIgnoredPromiseFromCall
    this.subscribe();
  }

  ngOnDestroy(): void {
    this.unsubscribe();
  }

  private renderInstantValue() {
    // get initial value first
    const translated = this.translateService.instant({
      ...this.getTranslateProps(),
      orEmpty: true,
    });
    this.setElementContent(translated);
  }

  private getTranslateProps() {
    return {
      key: this.key,
      ns: this.ns,
      params: this.params,
      defaultValue: this.default,
      noWrap: this.noWrap,
    };
  }

  private unsubscribe() {
    this.subscription?.unsubscribe();
  }

  private async subscribe() {
    this.unsubscribe();
    this.subscription = this.translateService
      .translate(this.getTranslateProps())
      .subscribe((translated) => {
        this.setElementContent(translated);
        this.initialized = true;
      });
  }

  private setElementContent(translated: string) {
    if (this.isHtml) {
      this.getElement().innerHTML = this.domSanitizer.sanitize(
        SecurityContext.HTML,
        translated
      );
      return;
    }
    this.getElement().textContent = translated;
  }

  private getElement() {
    return this.ref.nativeElement as HTMLElement;
  }
}
