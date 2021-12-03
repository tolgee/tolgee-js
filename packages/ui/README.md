# Tolgee JS UI library

![test workflow](https://github.com/tolgee/tolgee-js/actions/workflows/test.yml/badge.svg)
![@tolgee/ui version](https://img.shields.io/npm/v/@tolgee/ui?label=%40tolgee%2Fui)
![types typescript](https://img.shields.io/badge/Types-Typescript-blue)
[![twitter](https://img.shields.io/twitter/follow/Tolgee_i18n?style=social)](https://twitter.com/Tolgee_i18n)
[![github stars](https://img.shields.io/github/stars/tolgee/tolgee-js?style=social)](https://github.com/tolgee/tolgee-js)

[<img src="https://raw.githubusercontent.com/tolgee/documentation/cca5778bcb8f57d28a03065d1927fcea31d0b089/tolgee_logo_text.svg" alt="Tolgee Toolkit" />](https://toolkit.tolgee.io)

UI library of Tolgee localization tool. For more information about Tolgee, visit our documentation website
[https://tolgee.io](tolgee.io).

## Installation

    npm install @tolgee/ui --save

First, create a Tolgee instance and provide **UI** constructor.

    import {Tolgee} from "@tolgee/core";
    import {UI} from "@tolgee/ui";

    const tg = Tolgee.init({
        apiKey: "your_api_key",
        apiUrl: "https://app.tolgee.io",
        ui: UI
    })

    tg.run();

Now you should be able to edit your texts in-context with **ALT + Clicking** your texts.

To learn more, check [Hello World example](https://toolkit.tolgee.io/docs/web/get_started/hello_world).
