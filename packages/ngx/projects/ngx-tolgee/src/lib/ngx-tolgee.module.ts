import { APP_INITIALIZER, NgModule } from '@angular/core';
import { TranslatePipe } from './translate.pipe';
import { TComponent } from './t.component';
import { TranslateService } from './translate.service';
import { LoaderComponent } from "./loader.component";

@NgModule({
  declarations: [TranslatePipe, TComponent, LoaderComponent],
  exports: [TranslatePipe, TComponent],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: (service: TranslateService) => {
        return async () => await service.start();
      },
      deps: [TranslateService],
      multi: true,
    },
  ],
})
export class NgxTolgeeModule {}
