import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {NgxPolygloatModule} from "@polygloat/ngx";
import {UI} from "@polygloat/ui";

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    NgxPolygloatModule.forRoot({
      apiUrl: "http://localhost:8202",
      apiKey: "this_is_dummy_api_key",
      ui: UI
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
