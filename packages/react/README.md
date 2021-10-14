![test workflow](https://github.com/tolgee/tolgee-js/actions/workflows/test.yml/badge.svg)
![@tolgee/react version](https://img.shields.io/npm/v/@tolgee/react?label=%40tolgee%2Freact)
![types typescript](https://img.shields.io/badge/Types-Typescript-blue)
![licence](https://img.shields.io/github/license/tolgee/tolgee-js)
![twitter](https://img.shields.io/twitter/follow/Tolgee_i18n?style=social)
[![github stars](https://img.shields.io/github/stars/tolgee/tolgee-js?style=social)](https://github.com/tolgee/tolgee-js)

# Tolgee for React

React integration library of Tolgee. For more information about using Tolgee with React, visit our
[documentation website 📖](https://tolgee.io/docs/web/using_with_react/installation). 

[<img src="https://raw.githubusercontent.com/tolgee/documentation/main/tolgee_logo_text.svg" alt="Tolgee" width="200" />](https://tolgee.io)

Lokalize (translate) your CRA, Gatsby, Next.js or other React projects to multiple languages with Tolgee. Integration of
Tolgee is extremely simple! 🇯🇵 🇰🇷 🇩🇪 🇨🇳 🇺🇸 🇫🇷 🇪🇸 🇮🇹 🇷🇺 🇬🇧

## Features
 - All in One localization solution for your JS application 🙌
 - Out of box in-context localization 🎉
 - Automated screenshot generation 📷
 - Translation management platform 🎈
 - Open-source 🔥

## Installation

First, install the package.

    npm install @tolgee/react --save

Then use the library in your app:

```typescript jsx
import { TolgeeProvider } from "@tolgee/react";
import { UI } from "@tolgee/ui";

...

<TolgeeProvider
  apiUrl={process.env.REACT_APP_TOLGEE_API_URL}
  apiKey={process.env.REACT_APP_TOLGEE_API_KEY}
  ui={process.env.REACT_APP_TOLGEE_API_KEY === "true" && UI}
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

const t = useTranslate();

...

t("key_to_translate")
```

## Prerequisites

1. You have some React based project
2. You have generated API key from [Tolgee Cloud](https://app.tolgee.io) or self-hosted Tolgee instance.

## Quick integration guide

![react-integrate-infinite](https://user-images.githubusercontent.com/18496315/137310546-d4addbe2-4825-4262-bd18-b731b1941bce.gif)

Learn more at our [documentation website 📖](https://tolgee.io). 
