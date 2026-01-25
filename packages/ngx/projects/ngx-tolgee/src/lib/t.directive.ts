import {
  Directive,
  ElementRef,
  input,
  inject,
  effect,
  computed,
  Renderer2,
} from '@angular/core';
import { TranslateService } from './translate.service';
import { TranslateParams, TranslationKey } from '@tolgee/web';

@Directive({
  selector: '[t]',
  standalone: true,
})
export class TDirective {
  key = input<TranslationKey>();
  ns = input<string>();
  params = input<TranslateParams<any>>();
  default = input<string>();
  noWrap = input<boolean>(false);
  language = input<string>();
  /**
   * When true, the innerHTML property of an element is set.
   * Use only when you're sure the HTML is sanitized.
   */
  isHtml = input<boolean>(false);

  private ref = inject<ElementRef<HTMLElement>>(ElementRef);
  private translate = inject(TranslateService);
  private renderer = inject(Renderer2);

  private translateParams = computed(() => ({
    key: this.key(),
    ns: this.ns(),
    params: this.params(),
    defaultValue: this.default(),
    noWrap: this.noWrap(),
    language: this.language(),
  }));

  constructor() {
    effect((onCleanup) => {
      const params = this.translateParams();

      const subscription = this.translate
        .translate(params)
        .subscribe((translated) => {
          this.setElementContent(translated);
        });

      // cleanup when params change or directive is destroyed
      onCleanup(() => subscription.unsubscribe());
    });
  }

  private setElementContent(translated: string) {
    if (this.isHtml()) {
      this.renderer.setProperty(this.ref.nativeElement, 'innerHTML', translated);
    } else {
      this.renderer.setProperty(this.ref.nativeElement, 'textContent', translated);
    }
  }
}
