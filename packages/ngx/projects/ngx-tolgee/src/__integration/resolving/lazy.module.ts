import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgxTolgeeModule } from '../../lib/ngx-tolgee.module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-lazy',
  template: ` <p data-testid="loaded">I am loaded!</p>
    <p t key="test" ns="test"></p>`,
})
export class LazyComponent {
  constructor() {}
}

const routes: Routes = [{ path: '', component: LazyComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LazyRoutingModule {}

@NgModule({
  declarations: [LazyComponent],
  imports: [CommonModule, LazyRoutingModule, NgxTolgeeModule],
})
export class LazyModule {}
