# Tolgee format-icu library

![test workflow](https://github.com/tolgee/tolgee-js/actions/workflows/test.yml/badge.svg)
![@tolgee/format-icu version](https://img.shields.io/npm/v/@tolgee/format-icu?label=%40tolgee%2Fformat-icu)
![types typescript](https://img.shields.io/badge/Types-Typescript-blue)
[![twitter](https://img.shields.io/twitter/follow/Tolgee_i18n?style=social)](https://twitter.com/Tolgee_i18n)
[![github stars](https://img.shields.io/github/stars/tolgee/tolgee-js?style=social)](https://github.com/tolgee/tolgee-js)

[<img src="https://raw.githubusercontent.com/tolgee/documentation/main/tolgee_logo_text.svg" alt="Tolgee" width="200" />](https://tolgee.io)

Icu format plugin for Tolgee. For more information about Tolgee Toolkit, visit our [documentation](https://tolgee.io/js-sdk).

## Installation

```
npm install @tolgee/format-icu
```

## Usage

First, create a Tolgee instance and run it.

```ts
import { FormatIcu } from "@tolgee/format-icu";

const tolgee = Tolgee()
  .use(FormatIcu())
  .init(...)

...
```

Now you can use ICU format in your translations. Example:

```ts
tolgee.t('test', 'Hello, I am {name}.', { name: 'John' })
// 'Hello, I am John.'
```

To learn more, check our [ICU format documentation](https://tolgee.io/platform/icu_message_format).