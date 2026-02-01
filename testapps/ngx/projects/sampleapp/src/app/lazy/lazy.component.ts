import { Component } from '@angular/core';
import { TDirective } from '@tolgee/ngx';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-lazy',
  templateUrl: './lazy.component.html',
  imports: [TDirective, RouterLink],
})
export default class LazyComponent {}
