import { Component } from '@angular/core';
import { TDirective } from '../../../lib/t.directive';

@Component({
  selector: 'app-lazy',
  template: `
    <p data-testid="loaded">I am loaded!</p>
    <p t key="test" ns="test"></p>
  `,
  imports: [TDirective],
})
export default class LazyComponent {}
