<!-- This file was generated using pnpm generate-readmes script

        Don't edit this file. Edit the README.md.njk. Macros can be found in readmeMacros/macros.njk

        -->

<h1 align="center" style="border-bottom: none">
    <b>
        <a href="https://tolgee.io">Tolgee for Svelte</a><br>
    </b>
    The Tolgee i18n SDK for Svelte
    <br>
</h1>

<div align="center">

[![Logo](https://user-images.githubusercontent.com/18496315/188628892-33fcc282-26f1-4035-8105-95952bd93de9.svg)](https://tolgee.io)

Tolgee is an open-source alternative to Crowdin, Phrase, or Lokalise with its very own revolutionary integrations.

![test workflow](https://github.com/tolgee/tolgee-js/actions/workflows/test.yml/badge.svg)

![@tolgee/svelte version](https://img.shields.io/npm/v/@tolgee/svelte?label=@tolgee/svelte)

![types typescript](https://img.shields.io/badge/Types-Typescript-blue)
![typescript](https://img.shields.io/github/languages/top/tolgee/tolgee-js)
![licence](https://img.shields.io/github/license/tolgee/tolgee-js)
[![github stars](https://img.shields.io/github/stars/tolgee/tolgee-js?style=social&label=Tolgee%20JS)](https://github.com/tolgee/tolgee-js)
[![github stars](https://img.shields.io/github/stars/tolgee/server?style=social&label=Tolgee%20Server)](https://github.com/tolgee/server)
[![Github discussions](https://img.shields.io/github/discussions/tolgee/tolgee-platform)](https://github.com/tolgee/tolgee-platform/discussions)

</div>

<div align="center">

[<img src="https://img.shields.io/badge/-Facebook-424549?style=social&logo=facebook" height=25 />](https://www.facebook.com/Tolgee.i18n)
[<img src="https://img.shields.io/badge/-Twitter-424549?style=social&logo=twitter" height=25 />](https://twitter.com/Tolgee_i18n)
[<img src="https://img.shields.io/badge/-Linkedin-424549?style=social&logo=linkedin" height=25 />](https://www.linkedin.com/company/tolgee)

**Become part of the family. Join [slack channel <img src="https://img.shields.io/badge/-Tolgee Comunity-424549?style=social&logo=slack" height=25 />](https://join.slack.com/t/tolgeecommunity/shared_invite/zt-195isb5u8-_RcSRgVJfvgsPpOBIok~IQ)**

</div>

# What is Tolgee for Svelte?

Svelte integration library of Tolgee. With this package, it's super simple to add i18n to your Svelte app!
For more information about using Tolgee with Svelte, visit the [docs 📖](https://tolgee.io/integrations/svelte).

Localize (translate) your Svelte or SvelteKit projects to multiple languages with Tolgee.
Integration of Tolgee is extremely simple! 🇯🇵 🇰🇷 🇩🇪 🇨🇳 🇺🇸 🇫🇷 🇪🇸 🇮🇹 🇷🇺 🇬🇧

## Quick links

- [Tolgee for Svelte docs](https://tolgee.io/js-sdk/integrations/svelte/overview)
- [Tolgee JS SDK docs](https://tolgee.io/js-sdk)
- [Tolgee Website](https://tolgee.io)
  - Product (Learn more about the great features)
    - [Dev tools](https://tolgee.io/features/dev-tools)
    - [Translation assistance](https://tolgee.io/features/translation-assistance)
    - [Collaboration](https://tolgee.io/features/collaboration)
- [Tolgee platform docs](https://tolgee.io/platform)

## Installation

```
npm install @tolgee/svelte
```

Then use the library in your app:

```svelte
<script lang="ts">
  import { TolgeeProvider, Tolgee, SveltePlugin, FormatSimple } from '@tolgee/svelte';

  const tolgee = Tolgee()
    .use(SveltePlugin())
    .use(FormatSimple())
    .init({
      apiUrl: import.meta.env.VITE_TOLGEE_API_URL,
      apiKey: import.meta.env.VITE_TOLGEE_API_KEY,
      language: 'en'
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

## Prerequisites

1. You have some Svelte-based project
2. You have generated an API key from [Tolgee Cloud](https://app.tolgee.io) or a self-hosted Tolgee instance.

## Why use Tolgee?

Tolgee saves a lot of time you would spend on localization tasks otherwise. It enables you to provide perfectly translated software.

### Features

- All-in-one localization solution for your JS application 🙌
- Out-of-box in-context localization 🎉
- Automated screenshot generation 📷
- Translation management platform 🎈
- Open-source 🔥

![Frame 47](https://user-images.githubusercontent.com/18496315/188637819-ac4eb02d-7859-4ca8-9807-27818a52782d.png)
Read more on the [Tolgee website](https://tolgee.io)

## Development

We welcome your PRs.

To develop the package locally:

1. Clone [the repository](https://github.com/tolgee/tolgee-js)
1. Install the packages in the repository root

```
pnpm install
```

1. Run the development script

```
pnpm develop:svelte
```

This runs the development suite of this monorepo for the `svelte` integration. The changes in each dependency package are
automatically built and propagated to the test application, which you can open and play within the browser.

### Testing

To run Jest tests of this package, execute

```
npm run test
```

In the `/packages/svelte` directory.

### End-to-end (e2e) testing

To run the e2e tests, simply execute

```
pnpm run e2e run svelte
```

To open and play with e2e tests, run:

```
pnpm run e2e open svelte
```

## Contributors

<a href="https://github.com/tolgee/tolgee-platform/graphs/contributors">
  <img alt="contributors" src="https://contrib.rocks/image?repo=tolgee/tolgee-js"/>
</a>
