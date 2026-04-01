{% import "../../../../readmeMacros/macros.njk.md" as macros %}
{{ macros.header('Tolgee for Angular', 'The Tolgee i18n SDK for Angular', packageName) }}

# What's Tolgee for Angular?
Angular integration library of Tolgee. With this package. It's super simple to add i18n to your Angular app!
For more information about using Tolgee with Angular, visit the [docs 📖](https://tolgee.io/integrations/angular).

{{ macros.integrationLinks('Tolgee for Angular docs', macros.v5link('integrations/angular/installation')) }}

{{ macros.installation('ngx') }}

Then register Tolgee in your application config using `provideTolgee`.

```typescript
import { ApplicationConfig } from '@angular/core';
import { provideTolgee, Tolgee, DevTools, TolgeeOptions } from '@tolgee/ngx';

const tolgeeConfig: TolgeeOptions = {
  availableLanguages: ['en', 'cs'],
  defaultLanguage: 'en',
  fallbackLanguage: 'en',

  // for development
  apiUrl: environment.tolgeeApiUrl,
  apiKey: environment.tolgeeApiKey,

  // for production
  staticData: {
    en: () => import('../i18n/en.json').then((m) => m.default),
    cs: () => import('../i18n/cs.json').then((m) => m.default),
  },
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideTolgee(() => Tolgee().use(DevTools()).init(tolgeeConfig)),
  ],
};
```

## Usage
In standalone components, import `TranslatePipe` and `TDirective` where you use them.

```typescript
{% raw %}
import { Component } from '@angular/core';
import { TDirective, TranslatePipe } from '@tolgee/ngx';

@Component({
  template: `
    <h1>{{ 'hello_world' | translate }}</h1>
    <h2 t key="providing_default_values"></h2>
  `,
  imports: [TranslatePipe, TDirective],
})
export class AppComponent {}
{% endraw %}
```

Imperative translation and language switching are available via `TranslateService`.

```typescript
{% raw %}
import { Component, inject } from '@angular/core';
import { TranslateService } from '@tolgee/ngx';

@Component({
  template: `
    <p>{{ title() }}</p>
    <p>{{ currentLanguage() }}</p>
  `,
})
export class LanguageSwitcherComponent {
  private readonly translateService = inject(TranslateService);

  title = this.translateService.translateSignal('hello_world');
  currentLanguage = this.translateService.languageSignal;

  async switchToCzech() {
    await this.translateService.changeLanguage('cs');
  }
}
{% endraw %}
```

If you prefer RxJS, `translateService.translate(...)` still returns an `Observable<string>`.

For lazy routes with namespaced translations, use `namespaceResolver` to load the namespace before the route renders.

```typescript
import { Routes } from '@angular/router';
import { namespaceResolver } from '@tolgee/ngx';

export const routes: Routes = [
  {
    path: 'lazy',
    loadComponent: () => import('./lazy/lazy.component'),
    data: { tolgeeNamespace: 'namespaced' },
    resolve: {
      _namespace: namespaceResolver,
    },
  },
];
```

Translating using pipe:
```html
<h1>{{'{{\'hello_world\' | translate}}'}}</h1>
```

Or using t attribute
```html
<h1 t key="providing_default_values"></h1>
```

{{ macros.prereq('Angular') }}

{{ macros.why() }}

## Development
{{ macros.developmentInstallation() }}
{{ macros.development('ngx') }}

{{ macros.developmentTesting('/packages/ngx') }}

{{ macros.e2eTesting('ngx') }}

{{ macros.contributors() }}
