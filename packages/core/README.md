# Tolgee core library

![test workflow](https://github.com/tolgee/tolgee-js/actions/workflows/test.yml/badge.svg)
![@tolgee/core version](https://img.shields.io/npm/v/@tolgee/core?label=%40tolgee%2Fcore)
![types typescript](https://img.shields.io/badge/Types-Typescript-blue)
[![twitter](https://img.shields.io/twitter/follow/Tolgee_i18n?style=social)](https://twitter.com/Tolgee_i18n)
[![github stars](https://img.shields.io/github/stars/tolgee/tolgee-js?style=social)](https://github.com/tolgee/tolgee-js)

[<img src="https://raw.githubusercontent.com/tolgee/documentation/main/tolgee_logo_text.svg" alt="Tolgee" width="200" />](https://tolgee.io)

Core library of Tolgee localization toolkit. For more information about Tolgee Toolkit, visit our [documentation](https://tolgee.io/js-sdk).

## You should not use this package directly

If you use Tolgee on web, use [@tolgee/web](https://github.com/tolgee/tolgee-js/tree/main/packages/web) package, which extends this package with web related functionality.

This package is platform agnostic, so it contains only the most general functionality.


## Installation

```
npm install @tolgee/core
```

## Usage

First, create a Tolgee instance and run it.

```ts
import { TolgeeCore } from "@tolgee/core";

const tg = TolgeeCore()
  .use(...)
  .init(...)

tg.run();
```

To learn more, check [Tolgee documentation](https://toolkit.tolgee.io/js-sdk).