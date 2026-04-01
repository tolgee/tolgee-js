import { Component, inject } from '@angular/core';
import { TranslateService } from '@tolgee/ngx';
import { NavbarComponent } from '../../component/navbar/navbar.component';
import { RouterLink } from '@angular/router';
import { TDirective, TranslatePipe } from '@tolgee/ngx';

@Component({
  selector: 'app-translation-methods',
  templateUrl: './translation-methods.component.html',
  imports: [NavbarComponent, RouterLink, TDirective, TranslatePipe],
})
export class TranslationMethodsComponent {
  private readonly translateService = inject(TranslateService);

  translatedWithoutParamsValue =
    this.translateService.translateSignal('this_is_a_key');

  translatedWithDefaultValue = this.translateService.translateSignal(
    'this_key_does_not_exist',
    'This is default'
  );

  translatedWithParamsValue = this.translateService.translateSignal(
    'this_is_a_key_with_params',
    {
      key: 'value',
      key2: 'value2',
    }
  );
}
