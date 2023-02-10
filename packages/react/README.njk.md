{% import "../../readmeMacros/macros.njk.md" as macros %}
{{ macros.header('Tolgee for React', 'The Tolgee i18n SDK for React', packageName) }}

# What is Tolgee for React?
React integration library of Tolgee. This package makes it super simple to add i18n to your React app!
For more information about using Tolgee with React, visit the [docs 📖](https://tolgee.io/integrations/react).

Localize (translate) your CRA, Next.js, or other React projects to multiple languages with Tolgee. Integration of Tolgee is extremely simple! 🇯🇵 🇰🇷 🇩🇪 🇨🇳 🇺🇸 🇫🇷 🇪🇸 🇮🇹 🇷🇺 🇬🇧

{{ macros.integrationLinks('Tolgee for React docs', macros.v5link('integrations/react/installation')) }}

{{ macros.installation('react') }}

Then use the library in your app:

```typescript jsx
import { TolgeeProvider, ReactPlugin, FormatSimple } from "@tolgee/react";

const tolgee = Tolgee()
  .use(ReactPlugin())
  .use(FormatSimple())
  .init({
    language: 'en',
    apiUrl: process.env.REACT_APP_TOLGEE_API_URL,
    apiKey: process.env.REACT_APP_TOLGEE_API_KEY
  });


<TolgeeProvider
  tolgee={tolgee}
>
  <Your app components>
</TolgeeProvider>
```

## Usage

![react-infinite](https://user-images.githubusercontent.com/18496315/137308502-844f5ccf-1895-414d-bf40-6707cb691853.gif)

To translate texts using Tolgee React integration, you can use `T` component or `useTranslate` hook.

### T component

```typescript jsx
import { T } from "@tolgee/react";

...

<T>translation_key</T>
```

or

```typescript jsx
<T keyName="translation_key">Default value</T>
```

### useTranslate hook

```javascript
import { useTranslate } from "@tolgee/react";

...

const { t } = useTranslate();

...

t("key_to_translate")
```

{{ macros.prereq('React') }}

{{ macros.why() }}

## Development
{{ macros.developmentInstallation() }}
{{ macros.development('react') }}

{{ macros.developmentTesting('/packages/react') }}

{{ macros.e2eTesting('react') }}

{{ macros.contributors() }}
