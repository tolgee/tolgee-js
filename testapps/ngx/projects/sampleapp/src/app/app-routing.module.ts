import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TranslationMethodsComponent } from './pages/translation-methods/translation-methods.component';
import { IndexComponent } from './pages/index/index.component';
import { AppComponent } from './app.component';
import { NavbarComponent } from './component/navbar/navbar.component';
import { LangSelectorComponent } from './component/lang-selector/lang-selector.component';
import { NgxTolgeeModule } from '@tolgee/ngx';
import { environment } from '../environments/environment';
import { UI } from '@tolgee/ui';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser'; // CLI imports router

const routes: Routes = [
  { path: 'translation-methods', component: TranslationMethodsComponent },
  { path: '', component: IndexComponent },
];

// configures NgModule imports and exports
@NgModule({
  declarations: [
    IndexComponent,
    AppComponent,
    TranslationMethodsComponent,
    NavbarComponent,
    LangSelectorComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    NgxTolgeeModule.forRoot({
      staticData: {
        en: () => import('../i18n/en.json'),
        cs: () => import('../i18n/cs.json'),
        de: () => import('../i18n/de.json'),
        fr: () => import('../i18n/fr.json'),
      },
      preloadFallback: true,
      apiUrl: environment.tolgeeApiUrl,
      apiKey: environment.tolgeeApiKey,
      ui: UI,
    }),
    RouterModule.forRoot(routes),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
