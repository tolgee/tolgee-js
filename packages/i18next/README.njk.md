{% import "../../readmeMacros/macros.njk.md" as macros %}

{{ macros.header('Tolgee i18next integration', 'A package enabling you to use i18next with Tolgee', packageName) }}

## What's the Tolgee i18next package?
Using i18next, but want to use cool Tolgee features like in-context editing or automated screenshot generation?
No worries. Tolgee i18next integration is here for you!

{{ macros.integrationLinks('Tolgee i18next docs', macros.v5link('integrations/i18next/installation')) }}

{{ macros.installation('i18next') }}

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

{{ macros.why() }}

## Development
{{ macros.developmentInstallation() }}
{{ macros.development('react-i18n') }}


{{ macros.developmentTesting('/packages/i18next') }}

{{ macros.contributors() }}
