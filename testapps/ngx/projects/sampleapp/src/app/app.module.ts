import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NgxTolgeeModule } from '@tolgee/ngx';
import { UI } from '@tolgee/ui';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    NgxTolgeeModule.forRoot({
      preloadFallback: true,
      apiUrl: 'http://localhost:8202',
      apiKey: 'this_is_dummy_api_key',
      ui: UI,
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
