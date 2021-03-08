# Tolgee core library

[<img src="https://raw.githubusercontent.com/tolgee/documentation/cca5778bcb8f57d28a03065d1927fcea31d0b089/tolgee_logo_text.svg" alt="Tolgee Toolkit" />](https://toolkit.tolgee.io)

Core library of Tolgee localization toolkit. For more information about Tolgee, visit our documentation website
[https://toolkit.tolgee.io](toolkit.tolgee.io).

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

To learn more, check [Hello World example](https://toolkit.tolgee.io/docs/web/get_started/hello_world).