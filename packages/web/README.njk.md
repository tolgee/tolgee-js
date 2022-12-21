{% import "../../readmeMacros/macros.njk.md" as macros %}

{{ macros.header('Tolgee JS Web', 'The base of Tolgee JS integrations for Web platform', packageName) }}

## What is Tolgee JS Web?
It's the core library of Tolgee JS integrations containing the parts supporting the web platform.
For more information about Tolgee JS integrations, visit the [docs]({{ macros.v5link() }}).

{{ macros.links() }}

{{ macros.installation('web') }}

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

{{ macros.why() }}

## Development
{{ macros.developmentInstallation() }}
{{ macros.developmentCore() }}

{{ macros.developmentTesting('/packages/core') }}

### End-to-end (e2e) testing

Each integration is end-to-end tested via cypress. The tests are defined in `/e2e/cypress/e2e` directory.

To run the e2e tests, simply run the following:
```
pnpm run e2e run <integration>
```
E.g.
```
pnpm run e2e run web
```

To open and play with e2e tests, run:
```
pnpm run e2e open <integration>
```

{{ macros.contributors() }}
