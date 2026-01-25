import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'root',
  template: `
    <a routerLink="" data-testid="root-link">Root</a>
    <a routerLink="./lazy" data-testid="lazy-link">Lazy</a>
    <router-outlet />
  `,
  imports: [RouterOutlet, RouterLink],
})
export class RootComponent {}
