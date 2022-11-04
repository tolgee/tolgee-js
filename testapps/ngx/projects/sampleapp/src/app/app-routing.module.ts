import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TranslationMethodsComponent } from './pages/translation-methods/translation-methods.component';
import { IndexComponent } from './pages/index/index.component';
import { NamespaceResolver } from '@tolgee/ngx';

const routes: Routes = [
  { path: 'translation-methods', component: TranslationMethodsComponent },
  { path: '', component: IndexComponent },
  {
    path: 'lazy',
    loadChildren: () => import('./lazy/lazy.module').then((m) => m.LazyModule),
    data: { tolgeeNamespace: 'submodule' },
    resolve: {
      _namespace: NamespaceResolver,
    },
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
