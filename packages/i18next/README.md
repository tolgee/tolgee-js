# Tolgee i18next integration

![test workflow](https://github.com/tolgee/tolgee-js/actions/workflows/test.yml/badge.svg)
![@tolgee/i18next version](https://img.shields.io/npm/v/@tolgee/i18next?label=%40tolgee%2Fi18next)
![types typescript](https://img.shields.io/badge/Types-Typescript-blue)
[![twitter](https://img.shields.io/twitter/follow/Tolgee_i18n?style=social)](https://twitter.com/Tolgee_i18n)
[![github stars](https://img.shields.io/github/stars/tolgee/tolgee-js?style=social)](https://github.com/tolgee/tolgee-js)

[<img src="https://raw.githubusercontent.com/tolgee/documentation/main/tolgee_logo_text.svg" alt="Tolgee" width="200" />](https://tolgee.io)

Tolgee i18next integration. For more information about Tolgee Toolkit, visit our [documentation](https://tolgee.io/js-sdk).

## Installation

```
npm install i18next @tolgee/i18next
```

## Usage

First, create a Tolgee instance and wrap your i18next instance withTolgee.

```ts
import i18n from 'i18next';
import { withTolgee, Tolgee, I18nextPlugin, FormatSimple } from '@tolgee/i18next';

const tolgee = Tolgee()
  .use(I18nextPlugin())
  .use(FormatSimple())
  .init({
    apiUrl: ...,
    apiKey: ...,
  });

withTolgee(i18n, tolgee)
  .use(...)
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

To learn more, check [Tolgee documentation](https://toolkit.tolgee.io/js-sdk).
