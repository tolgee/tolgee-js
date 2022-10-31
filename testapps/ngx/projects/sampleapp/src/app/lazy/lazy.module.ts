import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LazyRoutingModule } from './lazy-routing.module';
import { LazyComponent } from './lazy.component';
import { NgxTolgeeModule } from '@tolgee/ngx';

@NgModule({
  declarations: [LazyComponent],
  imports: [CommonModule, LazyRoutingModule, NgxTolgeeModule],
})
export class LazyModule {}
