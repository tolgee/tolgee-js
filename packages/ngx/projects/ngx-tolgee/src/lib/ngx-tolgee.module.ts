import { APP_INITIALIZER, ModuleWithProviders, NgModule } from '@angular/core';
import { TranslatePipe } from './translate.pipe';
import { TranslationsProvider } from './translations-provider';
import { TranslateService } from './translate.service';
import { STranslatePipe } from './stranslate.pipe';
import { TolgeeConfig } from './tolgeeConfig';
import { TComponent } from './t.component';

@NgModule({
  declarations: [TranslatePipe, STranslatePipe, TComponent],
  exports: [TranslatePipe, STranslatePipe, TComponent],
  providers: [],
})
export class NgxTolgeeModule {
  // @dynamic
  static forRoot(options: TolgeeConfig): ModuleWithProviders<NgxTolgeeModule> {
    options = { filesUrlPrefix: '/assets/i18n/', ...options };
    return {
      ngModule: NgxTolgeeModule,
      providers: [
        TranslateService,
        TranslationsProvider,
        {
          provide: APP_INITIALIZER,
          useFactory: (provider: TranslationsProvider) => {
            return async () => await provider.load(options);
          },
          deps: [TranslationsProvider, TranslateService],
          multi: true,
        },
        { provide: TolgeeConfig, useValue: options },
      ],
    };
  }
}
