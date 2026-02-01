import { Routes } from '@angular/router';
import { TranslationMethodsComponent } from './pages/translation-methods/translation-methods.component';
import { IndexComponent } from './pages/index/index.component';
import { namespaceResolver } from '@tolgee/ngx';

export const routes: Routes = [
  { path: 'translation-methods', component: TranslationMethodsComponent },
  { path: '', component: IndexComponent },
  {
    path: 'lazy',
    loadComponent: () => import('./lazy/lazy.component'),
    data: { tolgeeNamespace: 'namespaced' },
    resolve: {
      _namespace: namespaceResolver,
    },
  },
];
