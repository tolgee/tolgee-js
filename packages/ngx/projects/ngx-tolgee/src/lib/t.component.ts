import {
  Component,
  ElementRef,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  Type,
  ViewContainerRef,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { TranslateService } from './translate.service';
import { TOLGEE_LOADING_TEMPLATE } from './loading-template';
import { TemplateHandler } from './template-handler';

@Component({
  selector: '[t]',
  template: ``,
})
export class TComponent implements OnInit, OnDestroy, OnChanges {
  @Input() params?: Record<string, any>;
  @Input() key: string;
  @Input() ns: string;
  @Input() default?: string;
  @Input() noWrap?: boolean;

  private subscription: Subscription;
  private initialized: boolean;
  private loaderTplHandler: TemplateHandler | undefined;

  constructor(
    private ref: ElementRef,
    private translateService: TranslateService,
    @Optional()
    @Inject(TOLGEE_LOADING_TEMPLATE)
    private loadingTemplate: Type<unknown> | string,
    private vcr: ViewContainerRef
  ) {}

  ngOnInit(): void {
    // noinspection JSIgnoredPromiseFromCall
    this.subscribe();
    if (this.shouldRenderLoading()) {
      this.renderLoading();
      return;
    }
    this.renderInstantValue();
  }

  ngOnChanges(): void {
    // noinspection JSIgnoredPromiseFromCall
    this.subscribe();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private renderInstantValue() {
    // set safe at first
    this.getElement().textContent = this.translateService.instant(
      this.getTranslateParams()
    );
  }

  private getTranslateParams() {
    return {
      key: this.key,
      ns: this.ns,
      params: this.params,
      defaultValue: this.default,
      noWrap: this.noWrap,
    };
  }

  private renderLoading() {
    this.loaderTplHandler = new TemplateHandler(this.loadingTemplate, this.vcr);
    this.loaderTplHandler.attachView();
  }

  private shouldRenderLoading() {
    return !this.isNamespaceLoaded() && this.loadingTemplate;
  }

  private isNamespaceLoaded() {
    return this.translateService.tolgee.isLoaded(this.ns);
  }

  private async subscribe() {
    this.subscription?.unsubscribe();

    await this.translateService.tolgee.addActiveNs(this.ns);

    this.subscription = this.translateService
      .translate(this.getTranslateParams())
      .subscribe((translated) => {
        this.loaderTplHandler?.detachView();
        this.getElement().textContent = translated;
        this.initialized = true;
      });
  }

  private getElement() {
    return this.ref.nativeElement as HTMLElement;
  }
}
