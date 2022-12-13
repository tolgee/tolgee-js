# Tolgee for Angular

![test workflow](https://github.com/tolgee/tolgee-js/actions/workflows/test.yml/badge.svg)
![@tolgee/ngx version](https://img.shields.io/npm/v/@tolgee/ngx?label=%40tolgee%2Fngx)
![types typescript](https://img.shields.io/badge/Types-Typescript-blue)
![licence](https://img.shields.io/github/license/tolgee/tolgee-js)
[![twitter](https://img.shields.io/twitter/follow/Tolgee_i18n?style=social)](https://twitter.com/Tolgee_i18n)
[![github stars](https://img.shields.io/github/stars/tolgee/tolgee-js?style=social)](https://github.com/tolgee/tolgee-js)

[<img src="https://raw.githubusercontent.com/tolgee/documentation/main/tolgee_logo_text.svg" alt="Tolgee" width="200" />](https://tolgee.io)

Localize (translate) your Angular app to multiple languages with Tolgee. For more information about using Tolgee with
Angular, visit our [documentation website](https://tolgee.io/js-sdk).
Integration of Tolgee is extremely simple! 🇯🇵 🇰🇷 🇩🇪 🇨🇳 🇺🇸 🇫🇷 🇪🇸 🇮🇹 🇷🇺 🇬🇧

## Features

- All in One localization solution for your JS application 🙌
- Out of box in-context localization 🎉
- Automated screenshot generation 📷
- Translation management platform 🎈
- Open-source 🔥

## Installation

First, install the package.

```
npm install @tolgee/ngx
```

Then import `NgxTolgeeModule` in your app.

```typescript
...

import {
  NgxPlugin,
  NgxTolgeeModule,
  Tolgee,
  TOLGEE_INSTANCE,
  FormatSimple
} from '@tolgee/ngx';

...

@NgModule({
  declarations: [
    ...
  ],
  imports: [
    NgxTolgeeModule,
    ...
  ],
  providers: [
    {
      provide: TOLGEE_INSTANCE,
      useFactory: () => {
        return Tolgee()
          .use(NgxPlugin())
          .use(FormatSimple())
          .init({
            apiUrl: environment.tolgeeApiUrl,
            apiKey: environment.tolgeeApiKey,
            language: 'en'
          });
      },
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
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
<p t key="user_account_title" [params]="{name: 'John Doe'}"></p>
<p t key="using_t_with_default" default="This is default"></p>
```

## Prerequisites

1. You have some Angular based project
2. You have generated API key from [Tolgee Cloud](https://app.tolgee.io) or self-hosted Tolgee instance.

## Quick integration guide

![Integrate](https://user-images.githubusercontent.com/18496315/137345763-c318df07-2de0-4c35-a28d-bf1e93b42997.gif)

Learn more at our [documentation website 📖](https://tolgee.io/js-sdk).
