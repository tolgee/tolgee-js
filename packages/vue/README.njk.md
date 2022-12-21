{% import "../../readmeMacros/macros.njk.md" as macros %}
{{ macros.header('Tolgee for Vue', 'The Tolgee i18n SDK for Vue', packageName) }}


# What is Tolgee for Vue?
Vue integration library of Tolgee. With this package, it's super simple to add i18n to your Vue app!
For more information about using Tolgee with Vue, visit the [docs 📖](https://tolgee.io/integrations/svelte).

Localize (translate) your Vue projects to multiple languages with Tolgee.
Integration of Tolgee is extremely simple! 🇯🇵 🇰🇷 🇩🇪 🇨🇳 🇺🇸 🇫🇷 🇪🇸 🇮🇹 🇷🇺 🇬🇧

> Currently we support vue v3 only

{{ macros.integrationLinks('Tolgee for Vue docs', macros.v5link('integrations/vue/installation')) }}

{{ macros.installation('vue') }}

Initialize tolgee

```ts
import { Tolgee, VuePlugin, VueTolgee, FormatSimple } from '@tolgee/vue';

const tolgee = Tolgee()
  .use(VuePlugin())
  .use(FormatSimple())
  .init({
    language: 'en',
    apiUrl: process.env.VUE_APP_TOLGEE_API_URL,
    apiKey: process.env.VUE_APP_TOLGEE_API_KEY,
  });

...

app.use(VueTolgee, { tolgee });
```

Then use the library in your app:

```html
<template>
  <TolgeeProvider>
    <template v-slot:fallback>
      <div>Loading...</div>
    </template>
    <App />
  </TolgeeProvider>
</template>
```



### T component

```html
<template>
  <T keyName="translation_key" />
</template>

<script setup>
  import { T } from '@tolgee/vue';
</script>
```

or with the default value

```html
<T keyName="translation_key" defaultValue="Default value" />
```

## Composition API for imperative translations

```html
<template>
  <div title="t('translation_key')">Hello</div>
</template>

<script setup>
  import { useTranslate } from '@tolgee/vue';

  const { t } = useTranslate();
</script>
```

or for language switching

```html
<template>
  <select
    :value="tolgee.getLanguage()"
    v-on:change="changeLanguage"
  >
    <option value="en">en</option>
    <option value="de">de</option>
  </select>
</template>

<script setup>
  import { useTolgee } from '@tolgee/vue';

  const tolgee = useTolgee(['language']);

  const changeLanguage = (e) => {
    tolgee.value.changeLanguage(e.target.value);
  };
</script>
```

{{ macros.prereq('Vue') }}

{{ macros.why() }}

## Development
{{ macros.developmentInstallation() }}
{{ macros.development('vue') }}

{{ macros.developmentTesting('/packages/vue') }}

{{ macros.e2eTesting('vue') }}

{{ macros.contributors() }}
