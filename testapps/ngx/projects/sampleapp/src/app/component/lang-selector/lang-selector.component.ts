import { Component, inject } from '@angular/core';
import { TranslateService } from '@tolgee/ngx';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-lang-selector',
  templateUrl: './lang-selector.component.html',
  imports: [AsyncPipe],
})
export class LangSelectorComponent {
  translateService = inject(TranslateService);
}
