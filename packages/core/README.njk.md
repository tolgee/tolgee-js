{% import "../../readmeMacros/macros.njk.md" as macros %}

{{ macros.header('Tolgee JS Core', 'The Core of Tolgee JS integrations', packageName) }}

## What is Tolgee JS Core?
It's the core library of Tolgee JS integrations containing the platform-agnostic parts of the Tolgee JS.
For more information about Tolgee JS integrations, visit the [docs]({{ macros.v5link() }}).

{{ macros.links() }}

## You should not use this package directly for usage in the web browser

If you use Tolgee on the web, use [@tolgee/web](https://github.com/tolgee/tolgee-js/tree/main/packages/web) package, which extends this package with web-related functionality.

This package is platform-agnostic, so it contains only the most general functionality.

{{ macros.installation('core') }}

## Usage

First, create a Tolgee instance and run it.

```ts
import { TolgeeCore } from "@tolgee/core";

const tg = TolgeeCore()
  .use(...)
  .init(...)

tg.run();
```

To learn more, check [the docs]({{ macros.v5link() }}).

{{ macros.why() }}

## Development
{{ macros.developmentInstallation() }}
{{ macros.developmentCore() }}

{{ macros.developmentTesting('/packages/core') }}

### End-to-end (e2e) testing

Each integration is end-to-end tested via cypress. The tests are defined in `/e2e/cypress/e2e` directory.

To run the e2e tests, run
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
