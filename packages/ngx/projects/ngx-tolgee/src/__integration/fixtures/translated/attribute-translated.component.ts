import { Component, input } from '@angular/core';
import { TDirective } from '../../../lib/t.directive';

@Component({
  template: `
    <div
      t
      key="peter_dogs"
      [params]="{ dogsCount: 5 }"
      data-testid="peter_dogs"
    ></div>
    <div t key="hello_world" data-testid="hello_world"></div>
    <div
      t
      key="hello_world"
      data-testid="hello_world_no_wrap"
      [noWrap]="true"
    ></div>
    <div
      t
      key="non_existent"
      data-testid="non_existent"
      default="Non existent"
    ></div>
    <div t key="with_tags" data-testid="with_tags" [isHtml]="true"></div>
    <div t key="with_tags" data-testid="with_tags_disabled"></div>
    <div t key="" data-testid="empty_key"></div>
    <div
      t
      key="hello_world"
      language="en"
      data-testid="with_language_prop"
    ></div>
    <div t key="hello_world" language="en" data-testid="with_value_props"></div>
    <div t [key]="key()" data-testid="with_changing_key"></div>
  `,
  imports: [TDirective],
  standalone: true,
})
export class AttributeTranslatedComponent {
  key = input<string>('hello_world');
}
