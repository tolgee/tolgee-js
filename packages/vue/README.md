# Tolgee for Vue

![test workflow](https://github.com/tolgee/tolgee-js/actions/workflows/test.yml/badge.svg)
![@tolgee/vue version](https://img.shields.io/npm/v/@tolgee/vue?label=%40tolgee%2Fvue)
![types typescript](https://img.shields.io/badge/Types-Typescript-blue)
![licence](https://img.shields.io/github/license/tolgee/tolgee-js)
![twitter](https://img.shields.io/twitter/follow/Tolgee_i18n?style=social)
[![github stars](https://img.shields.io/github/stars/tolgee/tolgee-js?style=social)](https://github.com/tolgee/tolgee-js)

# Tolgee for Vue

Vue integration library of Tolgee. For more information about using Tolgee with Vue, visit our
[documentation website 📖](https://tolgee.io/js-sdk).


> Currently we support vue v3 only

[<img src="https://raw.githubusercontent.com/tolgee/documentation/main/tolgee_logo_text.svg" alt="Tolgee" width="200" />](https://tolgee.io)

## Features

- All in One localization solution for your JS application 🙌
- Out of box in-context localization 🎉
- Automated screenshot generation 📷
- Translation management platform 🎈
- Open-source 🔥

## Installation

First, install the package.

```
npm install @tolgee/vue
```

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

or with default value

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

## Prerequisites

1. You have some Vue based project
2. You have generated API key from [Tolgee Cloud](https://app.tolgee.io) or self-hosted Tolgee instance.

Learn more at our [documentation website 📖](https://tolgee.io/js-sdk).
