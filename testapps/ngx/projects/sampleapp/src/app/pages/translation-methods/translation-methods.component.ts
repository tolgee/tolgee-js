import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@tolgee/ngx';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-translation-methods',
  templateUrl: './translation-methods.component.html',
})
export class TranslationMethodsComponent implements OnInit {
  translatedWithoutParams: Observable<string>;
  translatedWithDefault: Observable<string>;
  translatedWithParams: Observable<string>;

  constructor(private translateService: TranslateService) {}

  ngOnInit(): void {
    this.translatedWithoutParams =
      this.translateService.translate('this_is_a_key');

    this.translatedWithDefault = this.translateService.translate(
      'this_key_does_not_exist',
      'This is default'
    );

    this.translatedWithParams = this.translateService.translate(
      'this_is_a_key_with_params',
      { key: 'value', key2: 'value2' }
    );
  }
}
