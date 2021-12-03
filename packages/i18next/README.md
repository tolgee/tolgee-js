# Tolgee i18next integration

![test workflow](https://github.com/tolgee/tolgee-js/actions/workflows/test.yml/badge.svg)
![@tolgee/i18next version](https://img.shields.io/npm/v/@tolgee/i18next?label=%40tolgee%2Fi18next)
![types typescript](https://img.shields.io/badge/Types-Typescript-blue)
[![twitter](https://img.shields.io/twitter/follow/Tolgee_i18n?style=social)](https://twitter.com/Tolgee_i18n)
[![github stars](https://img.shields.io/github/stars/tolgee/tolgee-js?style=social)](https://github.com/tolgee/tolgee-js)

[<img src="https://raw.githubusercontent.com/tolgee/documentation/main/tolgee_logo_text.svg" alt="Tolgee" width="200" />](https://tolgee.io)

Tolgee i18next integration. For more information about Tolgee Toolkit, visit our documentation website
[tolgee.io](https://tolgee.io).

## Installation

```
npm install i18next @tolgee/i18next
```

## Usage

First, create a Tolgee instance and initialize it.

```ts
import i18next from 'i18next';
import { withTolgee } from "@tolgee/i18next";

withTolgee(i18n, { ... tolgee config ... })
  .init({ ... i18next config ... })
```

This will:

- use add `tolgeeBackend` as backend plugin
- use `tolgeeProcessor` for wrapping translations (with invivisible wrapperMode)
- will call `tolgeeApply` on i18n instance to apply listeners and register tolgee (`i18n.tolgee`)
- will wrap `.init` function with custom function, which will use `tolgeeOptions` to merge config with our custom config that is needed for in-context to work

We also recommend using `ICU message format`, which is supported by Tolgee platform.

```
npm install i18next-icu
```

```ts
import ICU from 'i18next-icu';

withTolgee(i18n, ...)
  .use(ICU)
  .init(...)
```

## Language changing

Tolgee will automatically switch language accordingly to i18next. So to get current language do:

```ts
const lang = i18n.lang;
```

To set language:

```ts
i18n.changeLanguage(lang);
```

To learn more, check [Tolgee docs](https://toolkit.tolgee.io/docs).
