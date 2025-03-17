{% import "../../readmeMacros/macros.njk.md" as macros %}
{{ macros.header('Tolgee for Svelte', 'The Tolgee i18n SDK for Svelte', packageName) }}

# What is Tolgee for Svelte?
Svelte integration library of Tolgee. With this package, it's super simple to add i18n to your Svelte app!
For more information about using Tolgee with Svelte, visit the [docs 📖](https://tolgee.io/integrations/svelte).

Localize (translate) your Svelte or SvelteKit projects to multiple languages with Tolgee.
Integration of Tolgee is extremely simple! 🇯🇵 🇰🇷 🇩🇪 🇨🇳 🇺🇸 🇫🇷 🇪🇸 🇮🇹 🇷🇺 🇬🇧

{{ macros.integrationLinks('Tolgee for Angular docs', macros.v5link('integrations/svelte/installation')) }}

{{ macros.installation('svelte') }}

Then use the library in your app:

```svelte
<script lang="ts">
  import {
    TolgeeProvider,
    Tolgee,
    SveltePlugin,
    FormatSimple,
  } from '@tolgee/svelte';

  const tolgee = Tolgee()
    .use(SveltePlugin())
    .use(FormatSimple())
    .init({
      apiUrl: import.meta.env.VITE_TOLGEE_API_URL,
      apiKey: import.meta.env.VITE_TOLGEE_API_KEY,
      language: 'en',
    });
</script>

<TolgeeProvider {tolgee}>
  <div slot="fallback">Loading...</div>
  <slot />
</TolgeeProvider>
```

## Usage

To translate texts using Tolgee Svelte integration, you can use `T` component or `getTranslate` function.

### T component

```svelte
<script>
  import { T } from '@tolgee/svelte';
</script>

<T keyName="key" defaultValue="This is default" />
```

### getTranslate function

The `getTranslate` function returns a store containing the function, which translates your key.

```svelte
<script>
  import { getTranslate } from '@tolgee/svelte';

  const { t } = getTranslate();
</script>

{$t('this_is_a_key', { key: 'value', key2: 'value2' })}
```

### Changing the language

To change the current language, use `getTolgee` method. For example, you can bind it to a select value.

```svelte
<script lang="ts">
  import { getTolgee } from '@tolgee/svelte';

  const tolgee = getTolgee(['language']);

  function handleLanguageChange(e) {
    $tolgee.changeLanguage(e.currentTarget.value);
  }
</script>

<select value={$tolgee.getLanguage()} on:change={handleLanguageChange}> ... </select>
```

{{ macros.prereq('Svelte') }}

{{ macros.why() }}

## Development
{{ macros.developmentInstallation() }}
{{ macros.development('svelte') }}

{{ macros.developmentTesting('/packages/svelte') }}

{{ macros.e2eTesting('svelte') }}

{{ macros.contributors() }}
