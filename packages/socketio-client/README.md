# Socket IO client for Tolgee Server

[<img src="https://raw.githubusercontent.com/tolgee/documentation/main/tolgee_logo_text.svg" alt="Tolgee" width="200" />](https://tolgee.io)

Simple client for Socket.io server embedded in Tolgee server to listen for data modification events live.

## Usage

```typescript
import {TranslationsClient} from "@tolgee/socketio-client";

const client = new TranslationsClient({
  authentication: {
    apiKey: 'your_cool_api_key',
  },
});

client.on('connect', () => {
  console.log('Yep! You\'re connected!');
});

client.on('translation_modified', (data) => {
  console.log(data);
})
```

Console output:
```
Yep! You\'re connected!
{
  id: 1000001001,
  text: 'Noice! This text was changed!',
  state: 'TRANSLATED',
  key: {
    id: 1000000901,
    name: 'dadsa dsa  dsaaa sd a asda dsasd sadas dsad',
    links: []
  },
  links: []
}
```

## Authentication
You can connect to socket.io server with your apiKey
```typescript
const client = new TranslationsClient({
  authentication: {
    apiKey: 'your_cool_api_key',
  },
});
```

or using `jwtToken` and `projectId`: 
```typescript
const client = new TranslationsClient({
  authentication: {
    projectId: 104,
    jwtToken: 'your cool jwtToken'
  },
});
```
## Supported events
* connect_error
* connect
* translation_created
* translation_modified
* translation_deleted
* key_created
* key_modified
* key_deleted
* reconnect_attempt
