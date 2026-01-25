import { Component, input } from '@angular/core';
import { TranslatePipe } from '../../../lib/translate.pipe';

@Component({
  template: `
    <div data-testid="peter_dogs">
      {{ 'peter_dogs' | translate: { dogsCount: 5 } }}
    </div>
    <div data-testid="hello_world">
      {{ 'hello_world' | translate }}
    </div>
    <div data-testid="hello_world_no_wrap">
      {{ 'hello_world' | translate: { noWrap: true } }}
    </div>
    <div data-testid="non_existent">
      {{ 'non_existent' | translate: 'Non existent' }}
    </div>
    <div data-testid="with_tags" [innerHTML]="'with_tags' | translate"></div>
    <div data-testid="with_tags_disabled">
      {{ 'with_tags' | translate }}
    </div>
    <div data-testid="empty_key">
      {{ '' | translate }}
    </div>
    <div data-testid="with_language_prop">
      {{ 'hello_world' | translate: { language: 'en' } }}
    </div>
    <div data-testid="with_value_props">
      {{ { key: 'hello_world', language: 'en' } | translate }}
    </div>
    <div data-testid="with_changing_key">
      {{ key() | translate }}
    </div>
  `,
  imports: [TranslatePipe],
})
export class PipeTranslatedComponent {
  key = input<string>('hello_world');
}
