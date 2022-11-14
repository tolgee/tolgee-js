import { Component } from '@angular/core';

@Component({
  selector: 'root',
  template: `
    <a [routerLink]="''" data-testid="root-link">Root</a>
    <a [routerLink]="'./lazy'" data-testid="lazy-link">Lazy</a>
    <router-outlet></router-outlet>
  `,
})
export class RootComponent {}
