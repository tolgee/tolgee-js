![test workflow](https://github.com/tolgee/tolgee-js/actions/workflows/test.yml/badge.svg)
![@tolgee/ngx version](https://img.shields.io/npm/v/@tolgee/ngx?label=%40tolgee%2Fngx)
![types typescript](https://img.shields.io/badge/Types-Typescript-blue)
![licence](https://img.shields.io/github/license/tolgee/tolgee-js)
[![twitter](https://img.shields.io/twitter/follow/Tolgee_i18n?style=social)](https://twitter.com/Tolgee_i18n)
[![github stars](https://img.shields.io/github/stars/tolgee/tolgee-js?style=social)](https://github.com/tolgee/tolgee-js)

# Tolgee for Angular

[<img src="https://raw.githubusercontent.com/tolgee/documentation/main/tolgee_logo_text.svg" alt="Tolgee" width="200" />](https://tolgee.io)

Lokalize (translate) your Angular app to multiple languages with Tolgee. For more information about using Tolgee with
angular, visit our [documentation website](https://toolkit.tolgee.io/docs/web/using_with_angular/installation).
Integration of Tolgee is extremely simple! 🇯🇵 🇰🇷 🇩🇪 🇨🇳 🇺🇸 🇫🇷 🇪🇸 🇮🇹 🇷🇺 🇬🇧

## Features

- All in One localization solution for your JS application 🙌
- Out of box in-context localization 🎉
- Automated screenshot generation 📷
- Translation management platform 🎈
- Open-source 🔥

## Installation

First, install the package.

    npm install @tolgee/ngx --save

Then import `NgxTolgeeModule` in your app.

```typescript
import { NgxTolgeeModule } from "@tolgee/ngx";
import { UI } from "@tolgee/ui";
import { NgModule } from '@angular/core';
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

![ngx-example-infinite](https://user-images.githubusercontent.com/18496315/137347353-9622c944-d021-4f02-a629-b411bc744c36.gif)

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

### Element with t attribute

```html
<h1 t key="providing_default_values"></h1>
<p t key="Peter has n dogs" [params]="params"></p>
```

## Prerequisites

1. You have some React based project
2. You have generated API key from [Tolgee Cloud](https://app.tolgee.io) or self-hosted Tolgee instance.

## Quick integration guide

![Integrate](https://user-images.githubusercontent.com/18496315/137345763-c318df07-2de0-4c35-a28d-bf1e93b42997.gif)
Learn more at our [documentation website 📖](https://tolgee.io).

