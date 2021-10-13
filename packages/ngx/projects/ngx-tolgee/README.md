![test workflow](https://github.com/tolgee/tolgee-js/actions/workflows/test.yml/badge.svg)
![@tolgee/ngx version](https://img.shields.io/npm/v/@tolgee/ngx?label=%40tolgee%2Fngx)
![types typescript](https://img.shields.io/badge/Types-Typescript-blue)
![twitter](https://img.shields.io/twitter/follow/Tolgee_i18n?style=social)
![github stars](https://img.shields.io/github/stars/tolgee/tolgee-js?style=social)

# Tolgee Angular integration library

[<img src="https://raw.githubusercontent.com/tolgee/documentation/main/tolgee_logo_text.svg" alt="Tolgee" width="200" />](https://tolgee.io)

Angular integration library of Tolgee Localization Toolkit. For more information about using Tolgee with angular,
visit our [documentation website](https://toolkit.tolgee.io/docs/web/using_with_angular/installation).

## Installation

First, install the package.

    npm install @tolgee/ngx --save

Then import `NgxTolgeeModule` in your app.

```typescript
import {NgxTolgeeModule} from "../clients/js/packages/ngx/dist/ngx-tolgee/tolgee-ngx";
import {UI} from "@tolgee/ui";
import {NgModule} from '@angular/core';
import { environment } from '../environments/environment';


@NgModule({
  declarations: [
    ...
  ],
  imports: [
    ...,
    NgxTolgeeModule.forRoot({
      apiUrl: environment.tolgeeApiUrl,
      apiKey: environment.tolgeeApiKey,
      ui: UI
    }),
...,
],
...,
})
export class AppModule {
}
```

## Usage

### Using pipe

```angular2html
<h1>{{'hello_world' | translate}}</h1>
```

### Using translateService

```ts
this.translateService
  .get('hello_world')
  .subscribe((r) => (this.helloWorld = r));
```
