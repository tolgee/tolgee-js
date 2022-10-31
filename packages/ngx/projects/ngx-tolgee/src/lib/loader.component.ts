import { Component, Input } from '@angular/core';

@Component({
  template: `
    <div class="loader-template" [innerHTML]="html"></div>
  `,
})
export class LoaderComponent {
  @Input() html: string | undefined;
}
