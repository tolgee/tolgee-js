# Example application of using React with Tolgee

[<img src="https://raw.githubusercontent.com/tolgee/documentation/main/tolgee_logo_text.svg" alt="Tolgee" width="100" />](https://tolgee.io)

This application is using VITE. To learn more about Tolgee, visit [https://tolgee.io](https://tolgee.io).

## Preview
![Tolgee Demo Example](https://github.com/user-attachments/assets/ca0d0ea0-a440-409f-a3cd-f93ef01dc197)

## To run the app in dev mode

To install dependencies, run:

    npm install

To run the app in dev mode with in-context translating mode:

1. Create a project on [Tolgee Cloud](https://app.tolgee.io) or use
   self-hosted [Tolgee Server](https://github.com/tolgee/server).
2. Generate an API-KEY
3. Copy file `.env` to `.env.development.local`
4. Set `VITE_APP_TOLGEE_API_KEY` to API key obtained in previous step
5. Run `npm run develop`
6. Have fun

## To exercise an unpublished @tolgee/web change in-context

The in-context editor is normally loaded from the CDN as a published `@tolgee/web` version. To try out local,
unpublished changes to it instead:

1. `cd packages/web && pnpm run build` (or the `build --filter=@tolgee/web...` turbo task) to produce
   `packages/web/dist/tolgee-in-context-tools.umd.min.js`.
2. Copy that file into `testapps/react/public/` (gitignored, so it never gets committed).
3. Set `VITE_APP_IN_CONTEXT_URL=/tolgee-in-context-tools.umd.min.js` in `.env.development.local`.
4. Run `npm run develop` as above.

This only takes effect on `localhost`/`127.0.0.1` — see `isTrustedInContextUrl` in
`packages/web/src/package/BrowserExtensionPlugin/loadInContextLib.ts`.

## To run the app in production mode

To build the app for production run:

    npm run build

Static website will be generated. To start local server with build app, run:

    npm run preview

---

This repository is automatically re-published from [Tolgee JS monorepo](https://github.com/tolgee/tolgee-js).
