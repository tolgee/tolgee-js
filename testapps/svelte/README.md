![test workflow](https://github.com/tolgee/tolgee-js/actions/workflows/test.yml/badge.svg)
![@tolgee/react version](https://img.shields.io/npm/v/@tolgee/svelte?label=%40tolgee%2Fsvelte)
![types typescript](https://img.shields.io/badge/Types-Typescript-blue)
![licence](https://img.shields.io/github/license/tolgee/tolgee-js)
[![twitter](https://img.shields.io/twitter/follow/Tolgee_i18n?style=social)](https://twitter.com/Tolgee_i18n)
[![github stars](https://img.shields.io/github/stars/tolgee/tolgee-js?style=social)](https://github.com/tolgee/tolgee-js)

# Example application of using Svelte with Tolgee

[<img src="https://raw.githubusercontent.com/tolgee/documentation/main/tolgee_logo_text.svg" alt="Tolgee" width="200" />](https://tolgee.io)

This application is using SvelteKit. To learn more about Tolgee, visit [https://tolgee.io](https://tolgee.io).

## To run the app in dev mode

To install dependencies, run:

    npm install

To run the app in dev mode with in-context translating mode:

1. Create a project on [Tolgee Cloud](https://app.tolgee.io) or use
   self-hosted [Tolgee Server](https://github.com/tolgee/server).
2. Generate an API-KEY
3. Copy file `.env` to `.env.development.local`
4. Set `VITE_TOLGEE_API_KEY` to API key obtained in previous step
5. Run `npm run dev`
6. Have fun

## To run the app in production mode

To build the app for production run:

    npm run build

Static website will be generated. To start local server with build app, run:

    npm run serve

---
This repository is automatically re-published from [Tolgee JS monorepo](https://github.com/tolgee/tolgee-js).
