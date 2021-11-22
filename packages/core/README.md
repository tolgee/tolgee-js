# Tolgee core library
![test workflow](https://github.com/tolgee/tolgee-js/actions/workflows/test.yml/badge.svg)
![@tolgee/core version](https://img.shields.io/npm/v/@tolgee/core?label=%40tolgee%2Fcore)
![types typescript](https://img.shields.io/badge/Types-Typescript-blue)
[![twitter](https://img.shields.io/twitter/follow/Tolgee_i18n?style=social)](https://twitter.com/Tolgee_i18n)
[![github stars](https://img.shields.io/github/stars/tolgee/tolgee-js?style=social)](https://github.com/tolgee/tolgee-js)



[<img src="https://raw.githubusercontent.com/tolgee/documentation/main/tolgee_logo_text.svg" alt="Tolgee" width="200" />](https://tolgee.io)

Core library of Tolgee localization toolkit. For more information about Tolgee Toolkit, visit our documentation website
[toolkit.tolgee.io](https://toolkit.tolgee.io).

## Installation

    npm install @tolgee/core --save

## Usage

First, create a Tolgee instance and run it.

    import {Tolgee} from "@tolgee/core";

    const tg = new Tolgee({
        apiKey: "your_api_key",
        apiUrl: "https://app.tolgee.io",
    })

    tg.run();

Then, use it to translate your strings.

    tg.onLangLoaded.subscribe(() => {
        document.title = tg.translate("hello_world");
    });

## Features
- All in One localization solution for your JS application 🙌
- Out of box in-context localization 🎉
- Automated screenshot generation 📷
- Translation management platform 🎈
- Open-source 🔥

To learn more, check [Hello World example](https://toolkit.tolgee.io/docs/web/get_started/hello_world).
