import { Pipe } from '@angular/core';
import { TranslateService } from './translate.service';
import { TranslatePipe } from './translate.pipe';
import { Observable } from 'rxjs';

@Pipe({
  name: 'stranslate',
  pure: false,
})
export class STranslatePipe extends TranslatePipe {
  constructor(translateService: TranslateService) {
    super(translateService);
  }

  protected get resultProvider(): (
    input,
    params,
    defaultValue
  ) => Observable<string> {
    return (input, params, defaultValue) =>
      this.translateService.getSafe(input, params, defaultValue);
  }
}
