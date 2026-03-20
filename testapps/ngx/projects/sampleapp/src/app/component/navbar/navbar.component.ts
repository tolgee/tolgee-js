import { Component } from '@angular/core';
import { LangSelectorComponent } from '../lang-selector/lang-selector.component';

@Component({
  selector: 'app-navbar',
  template: `
    <div class="navbar">
      <app-lang-selector />
      <nav>
        <ng-content />
      </nav>
    </div>
  `,
  imports: [LangSelectorComponent],
})
export class NavbarComponent {}
