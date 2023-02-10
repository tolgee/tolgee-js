<!-- This file was generated using pnpm generate-readmes script 
        
        Don't edit this file. Edit the README.md.njk. Macros can be found in readmeMacros/macros.njk
        
        -->


<h1 align="center" style="border-bottom: none">
    <b>
        <a href="https://tolgee.io">Tolgee JS Core</a><br>
    </b>
    The Core of Tolgee JS integrations
    <br>
</h1>

<div align="center">

[![Logo](https://user-images.githubusercontent.com/18496315/188628892-33fcc282-26f1-4035-8105-95952bd93de9.svg)](https://tolgee.io)

Tolgee is an open-source alternative to Crowdin, Phrase, or Lokalise with its very own revolutionary integrations.

![test workflow](https://github.com/tolgee/tolgee-js/actions/workflows/test.yml/badge.svg)

![@tolgee/core version](https://img.shields.io/npm/v/@tolgee/core?label=@tolgee/core)

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



## What is Tolgee JS Core?
It's the core library of Tolgee JS integrations containing the platform-agnostic parts of the Tolgee JS.
For more information about Tolgee JS integrations, visit the [docs](https://tolgee.io/js-sdk/5.0.0-alpha.1/).


## Quick links
- [Tolgee JS SDK docs](https://tolgee.io/js-sdk)
- [Tolgee Website](https://tolgee.io)
    - Product (Learn more about the great features)
        - [Dev tools](https://tolgee.io/features/dev-tools)
        - [Translation assistance](https://tolgee.io/features/translation-assistance)
        - [Collaboration](https://tolgee.io/features/collaboration)
- Integrations (Learn how to integrate Tolgee with your favorite technology)
    - [React](https://tolgee.io/integrations/react)
    - [Angular](https://tolgee.io/integrations/angular)
    - [Vue](https://tolgee.io/integrations/vue)
    - [Svelte](https://tolgee.io/integrations/svelte)
    - [Next.js](https://tolgee.io/integrations/next)
    - [More...](https://tolgee.io/integrations/all)
- [Tolgee platform docs](https://tolgee.io/platform)
  

## You should not use this package directly for usage in the web browser

If you use Tolgee on the web, use [@tolgee/web](https://github.com/tolgee/tolgee-js/tree/main/packages/web) package, which extends this package with web-related functionality.

This package is platform-agnostic, so it contains only the most general functionality.


## Installation

```
npm install @tolgee/core
```


## Usage

First, create a Tolgee instance and run it.

```ts
import { TolgeeCore } from "@tolgee/core";

const tg = TolgeeCore()
  .use(...)
  .init(...)

tg.run();
```

To learn more, check [the docs](https://tolgee.io/js-sdk/5.0.0-alpha.1/).


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


1. Run web or any integration development script
```
pnpm develop:react
```
or
```
pnpm develop:web
```
This runs the development suite of this monorepo for the specific integration. The changes in each dependency package are
automatically built and propagated to the test application, which you can open and play within the browser.




### Testing

To run Jest tests of this package, execute
```
npm run test
```
In the `/packages/core` directory.


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


## Contributors

<a href="https://github.com/tolgee/tolgee-platform/graphs/contributors">
  <img alt="contributors" src="https://contrib.rocks/image?repo=tolgee/tolgee-js"/>
</a>

