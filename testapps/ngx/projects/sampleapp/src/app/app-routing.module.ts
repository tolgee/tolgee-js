import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TranslationMethodsComponent } from './pages/translation-methods/translation-methods.component';
import { IndexComponent } from './pages/index/index.component';

const routes: Routes = [
  { path: 'translation-methods', component: TranslationMethodsComponent },
  { path: '', component: IndexComponent },
  {
    path: 'lazy',
    loadChildren: () => import('./lazy/lazy.module').then((m) => m.LazyModule),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      initialNavigation: 'enabledBlocking',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
