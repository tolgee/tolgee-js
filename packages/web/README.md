# Tolgee web library

![test workflow](https://github.com/tolgee/tolgee-js/actions/workflows/test.yml/badge.svg)
![@tolgee/web version](https://img.shields.io/npm/v/@tolgee/web?label=%40tolgee%2Fweb)
![types typescript](https://img.shields.io/badge/Types-Typescript-blue)
[![twitter](https://img.shields.io/twitter/follow/Tolgee_i18n?style=social)](https://twitter.com/Tolgee_i18n)
[![github stars](https://img.shields.io/github/stars/tolgee/tolgee-js?style=social)](https://github.com/tolgee/tolgee-js)

[<img src="https://raw.githubusercontent.com/tolgee/documentation/main/tolgee_logo_text.svg" alt="Tolgee" width="200" />](https://tolgee.io)

Tolgee localization toolkit for web. For more information about Tolgee Toolkit, visit our [documentation](https://tolgee.io/js-sdk).

## Installation

```
npm install @tolgee/web
```

## Usage

First, create a Tolgee instance and run it.

```ts
import { Tolgee, DevTools, FormatSimple } from "@tolgee/web";

const tg = Tolgee()
  .use(DevTools())
  .use(FormatSimple())
  .init({
    apiKey: "your_api_key",
    apiUrl: "https://app.tolgee.io",
  })

tg.run();
```

Then, use it to translate your strings.

```ts
tg.onLangLoaded.subscribe(() => {
  document.title = tg.translate("hello_world");
});
```

## Features

- All in One localization solution for your JS application 🙌
- Out of box in-context localization 🎉
- Automated screenshot generation 📷
- Translation management platform 🎈
- Open-source 🔥

To learn more, check [Tolgee documentation](https://toolkit.tolgee.io/js-sdk).