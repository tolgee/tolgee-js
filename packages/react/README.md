<!-- This file was generated using pnpm generate-readmes script 
        
        Don't edit this file. Edit the README.md.njk. Macros can be found in readmeMacros/macros.njk
        
        -->

<h1 align="center" style="border-bottom: none">
    <b>
        <a href="https://tolgee.io">Tolgee for React</a><br>
    </b>
    The Tolgee i18n SDK for React
    <br>
</h1>

<div align="center">

[![Logo](https://user-images.githubusercontent.com/18496315/188628892-33fcc282-26f1-4035-8105-95952bd93de9.svg)](https://tolgee.io)

Tolgee is an open-source alternative to Crowdin, Phrase, or Lokalise with its very own revolutionary integrations.

![test workflow](https://github.com/tolgee/tolgee-js/actions/workflows/test.yml/badge.svg)

![@tolgee/react version](https://img.shields.io/npm/v/@tolgee/react?label=@tolgee/react)

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



# What is Tolgee for React?
React integration library of Tolgee. This package makes it super simple to add i18n to your React app!
For more information about using Tolgee with React, visit the [docs 📖](https://tolgee.io/integrations/react).

Localize (translate) your CRA, Next.js, or other React projects to multiple languages with Tolgee. Integration of Tolgee is extremely simple! 🇯🇵 🇰🇷 🇩🇪 🇨🇳 🇺🇸 🇫🇷 🇪🇸 🇮🇹 🇷🇺 🇬🇧


## Quick links
- [Tolgee for React docs](https://tolgee.io/js-sdk/5.0.0-alpha.1/integrations/react/installation)
- [Tolgee JS SDK docs](https://tolgee.io/js-sdk)
- [Tolgee Website](https://tolgee.io)
    - Product (Learn more about the great features)
        - [Dev tools](https://tolgee.io/features/dev-tools)
        - [Translation assistance](https://tolgee.io/features/translation-assistance)
        - [Collaboration](https://tolgee.io/features/collaboration)
- [Tolgee platform docs](https://tolgee.io/platform)
  


## Installation

```
npm install @tolgee/react
```


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


## Prerequisites

1. You have some React-based project
2. You have generated an API key from [Tolgee Cloud](https://app.tolgee.io) or a self-hosted Tolgee instance.
   


## Why to use Tolgee?
Because it saves a lot of time, you would spend on localization tasks without it. Because it enables you to provide perfectly translated software.

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
pnpm develop:react
```
This runs the development suite of this monorepo for the `react` integration. The changes in each dependency package are
automatically built and propagated to the test application, which you can open and play within the browser.




### Testing

To run Jest tests of this package, execute
```
npm run test
```
In the `/packages/react` directory.




### End-to-end (e2e) testing
To run the e2e tests, simply execute
```
pnpm run e2e run react
```

To open and play with e2e tests, run:
```
pnpm run e2e open react
```



## Contributors

<a href="https://github.com/tolgee/tolgee-platform/graphs/contributors">
  <img alt="contributors" src="https://contrib.rocks/image?repo=tolgee/tolgee-js"/>
</a>

