import { Component, inject } from '@angular/core';
import { TranslateService } from '@tolgee/ngx';

@Component({
  selector: 'app-lang-selector',
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

  readonly language = this.translateService.languageSignal;

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
