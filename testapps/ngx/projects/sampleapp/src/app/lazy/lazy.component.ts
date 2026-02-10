import { Component } from '@angular/core';
import { TDirective } from '@tolgee/ngx';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-lazy',
  template: `
    <main class="translation-methods">
      <a routerLink="/">The example app</a>

      <div class="tiles namespaces">
        <div>
          <h1>Namespaced key</h1>
          <div t key="this_is_a_key" ns="namespaced"></div>
        </div>
      </div>
    </main>
  `,
  imports: [TDirective, RouterLink],
})
export default class LazyComponent {}
