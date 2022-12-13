# Tolgee for Svelte

![test workflow](https://github.com/tolgee/tolgee-js/actions/workflows/test.yml/badge.svg)
![@tolgee/svelte version](https://img.shields.io/npm/v/@tolgee/svelte?label=%40tolgee%2Fsvelte)
![types typescript](https://img.shields.io/badge/Types-Typescript-blue)
![licence](https://img.shields.io/github/license/tolgee/tolgee-js)
[![twitter](https://img.shields.io/twitter/follow/Tolgee_i18n?style=social)](https://twitter.com/Tolgee_i18n)
[![github stars](https://img.shields.io/github/stars/tolgee/tolgee-js?style=social)](https://github.com/tolgee/tolgee-js)

Svelte integration library (SDK) of Tolgee. For more information about using Tolgee with Svelte, visit our [documentation](https://tolgee.io/js-sdk).

[<img src="https://raw.githubusercontent.com/tolgee/documentation/main/tolgee_logo_text.svg" alt="Tolgee" width="200" />](https://tolgee.io)

Lokalize (translate) your Svelte projects to multiple languages with Tolgee. Integration of Tolgee is extremely simple!
🇯🇵 🇰🇷 🇩🇪 🇨🇳 🇺🇸 🇫🇷 🇪🇸 🇮🇹 🇷🇺 🇬🇧

## Features

- All in One localization solution for your Svelte application 🙌
- Out of box in-context localization 🎉
- Automated screenshot generation 📷
- Translation management platform 🎈
- Supports SSR with svelte kit 🎉
- Open-source 🔥

## Installation

First, install the package.

```
npm install @tolgee/svelte
```

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

The `getTranslate` function returns store containing the function, which actually translates your key.

```svelte
<script>
  import { getTranslate } from '@tolgee/svelte';

  const { t } = getTranslate();
</script>

{$t('this_is_a_key', { key: 'value', key2: 'value2' })}
```

### Changing the language

To change the current language, use `getLanguageStore` method. For example, you can bind it to select value.

```svelte
<script lang="ts">
  import { getTolgee } from '@tolgee/svelte';

  const tolgee = getTolgee(['language']);

  function handleLanguageChange(e) {
    $tolgee.changeLanguage(e.currentTarget.value);
  }
</script>

<select value={$tolgee.getLanguage()} on:change={handleLanguageChange}>
  ...
</select>
```

## Prerequisites

1. You have some Svelte based project
2. You have generated API key from [Tolgee Cloud](https://app.tolgee.io) or self-hosted Tolgee instance.

## Quick integration guide

Learn more at our [documentation](https://tolgee.io/js-sdk).
