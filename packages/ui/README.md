# Tolgee JS UI library

[<img src="https://raw.githubusercontent.com/tolgee/documentation/cca5778bcb8f57d28a03065d1927fcea31d0b089/tolgee_logo_text.svg" alt="Tolgee Toolkit" />](https://toolkit.tolgee.io)

UI library of Tolgee localization toolkit. For more information about Tolgee, visit our documentation website
[https://toolkit.tolgee.io](toolkit.tolgee.io).

## Installation

    npm install @tolgee/ui --save

First, create a Tolgee instance and provide **UI** constructor.

    import {Tolgee} from "@tolgee/core";
    import {UI} from "@tolgee/ui";

    const tg = new Tolgee({
        apiKey: "your_api_key",
        apiUrl: "https://app.tolgee.io",
        ui: UI

    })

    tg.run();

Now you should be able to edit your texts in-context with **ALT + Clicking** your texts.

To learn more, check [Hello World example](https://toolkit.tolgee.io/docs/web/get_started/hello_world).