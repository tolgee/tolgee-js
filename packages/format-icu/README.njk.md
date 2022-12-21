{% import "../../readmeMacros/macros.njk.md" as macros %}

{{ macros.header('Tolgee ICU Format Plugin', 'The ICU Formatter Plugin for Tolgee JS integrations', packageName) }}

## What is Icu Format Plugin?
It's a plugin for Tolgee JS, which enables the rendering of messages in [ICU message format](https://tolgee.io/platform/icu_message_format).
For more information about the Tolgee ICU Format plugin, visit the [docs]({{ macros.v5link('formatting#icu-formatter') }}).

{{ macros.links() }}

{{ macros.installation('format-icu') }}

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

Check our [ICU format documentation](https://tolgee.io/platform/icu_message_format) to learn more.

{{ macros.why() }}

## Development
{{ macros.developmentInstallation() }}
{{ macros.developmentCore() }}

{{ macros.developmentTesting('/packages/format-icu') }}

{{ macros.contributors() }}
