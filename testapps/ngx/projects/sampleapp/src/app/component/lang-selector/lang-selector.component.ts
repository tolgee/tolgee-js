import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslateService } from '@tolgee/ngx';

@Component({
  selector: 'app-lang-selector',
  standalone: true,
  template: `
    <select
      [value]="language()"
      (change)="changeLanguage($event)"
      class="lang-selector"
    >
      @for (lang of availableLanguages; track lang.code) {
        <option [value]="lang.code">{{ lang.name }}</option>
      }
    </select>
  `,
})
export class LangSelectorComponent {
  private readonly translateService = inject(TranslateService);

  readonly language = toSignal(this.translateService.languageAsync, {
    requireSync: true,
  });

  readonly availableLanguages = [
    { code: 'en', name: 'English' },
    { code: 'cs', name: 'Česky' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
  ] as const;

  async changeLanguage({ target }: Event) {
    const { value } = target as HTMLSelectElement;
    await this.translateService.changeLanguage(value);
  }
}
