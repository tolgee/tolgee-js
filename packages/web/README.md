<!-- This file was generated using pnpm generate-readmes script 
        
        Don't edit this file. Edit the README.md.njk. Macros can be found in readmeMacros/macros.njk
        
        -->


<h1 align="center" style="border-bottom: none">
    <b>
        <a href="https://tolgee.io">Tolgee JS Web</a><br>
    </b>
    The base of Tolgee JS integrations for Web platform
    <br>
</h1>

<div align="center">

[![Logo](https://user-images.githubusercontent.com/18496315/188628892-33fcc282-26f1-4035-8105-95952bd93de9.svg)](https://tolgee.io)

Tolgee is an open-source alternative to Crowdin, Phrase, or Lokalise

![test workflow](https://github.com/tolgee/tolgee-js/actions/workflows/test.yml/badge.svg)  ![@tolgee/web version](https://img.shields.io/npm/v/@tolgee/web?label=@tolgee/web) 
![typescript](https://img.shields.io/github/languages/top/tolgee/tolgee-js)
![Types Typescript](https://img.shields.io/badge/Types-Typescript-blue)
![Licence](https://img.shields.io/github/license/tolgee/tolgee-js)
[![GitHub Stars](https://img.shields.io/github/stars/tolgee/tolgee-js?style=social&label=Tolgee%20JS)](https://github.com/tolgee/tolgee-js)

[![GitHub Stars](https://img.shields.io/github/stars/tolgee/tolgee-platform?style=social&label=Tolgee%20Platform)](https://github.com/tolgee/tolgee-platform)
[![GitHub Discussions](https://img.shields.io/github/discussions/tolgee/tolgee-platform)](https://github.com/tolgee/tolgee-platform/discussions)
[![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=fff)](https://hub.docker.com/repository/docker/tolgee/tolgee)
[![Read the Docs](https://img.shields.io/badge/Read%20the%20Docs-8CA1AF?logo=readthedocs&logoColor=fff)](https://docs.tolgee.io/)
[![Slack](https://img.shields.io/badge/Slack-4A154B?logo=slack&logoColor=fff)](https://join.slack.com/t/tolgeecommunity/shared_invite/zt-2zp55d175-_agXTfKKVbf1BYXlKlmwbA)
[![Dev.to](https://img.shields.io/badge/Dev.to-tolgee_i18n?logo=devdotto&logoColor=white)](https://dev.to/tolgee_i18n)
[![YouTube](https://img.shields.io/badge/YouTube-%23FF0000.svg?logo=YouTube&logoColor=white)](https://www.youtube.com/@tolgee)
[![LinkedIn](https://custom-icon-badges.demolab.com/badge/LinkedIn-0A66C2?logo=linkedin-white&logoColor=fff)](https://www.linkedin.com/company/tolgee/)
[![X](https://img.shields.io/badge/X-%23000000.svg?logo=X&logoColor=white)](https://x.com/Tolgee_i18n)

</div>



## What is Tolgee JS Web?
It's the core library of Tolgee JS integrations containing the parts supporting the web platform.
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
  


## Installation

```
npm install @tolgee/web
```


## Usage

First, create a Tolgee instance and run it.

```ts
import { Tolgee, DevTools, FormatSimple } from "@tolgee/web";

const tg = Tolgee()
  .use(DevTools())
  .use(FormatSimple())
  .init({
    apiKey: "your_api_key",
    apiUrl: "https://app.tolgee.io",
  })

tg.run();
```

Then, use it to translate your strings.

```ts
tg.onLangLoaded.subscribe(() => {
  document.title = tg.translate("hello_world");
});
```


## Why to use Tolgee?
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

To run the e2e tests, simply run the following:
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

