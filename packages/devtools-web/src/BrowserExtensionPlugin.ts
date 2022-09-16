import type { TolgeeInstance, TolgeePlugin } from '@tolgee/core';
import { handshakeWithExtension, listen } from './tools/plugin';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const API_KEY_LOCAL_STORAGE = '__tolgee_apiKey';
export const API_URL_LOCAL_STORAGE = '__tolgee_apiUrl';

const registredInstances = [] as TolgeeInstance[];

function getCredentials() {
  const apiKey = sessionStorage.getItem(API_KEY_LOCAL_STORAGE) || undefined;
  const apiUrl = sessionStorage.getItem(API_URL_LOCAL_STORAGE) || undefined;
  return {
    apiKey,
    apiUrl,
  };
}

function clearSessionStorage() {
  sessionStorage.removeItem(API_KEY_LOCAL_STORAGE);
  sessionStorage.removeItem(API_URL_LOCAL_STORAGE);
}

listen('SET_CREDENTIALS', () => {
  registredInstances.forEach(async (tolgee) => {
    const credentials = getCredentials();
    if (credentials.apiKey) {
      tolgee.init({
        ...credentials,
      });
      const { unsubscribe } = tolgee.on('initialLoad', async () => {
        unsubscribe();
        const result = tolgee.highlight();
        await sleep(300);
        result.unhighlight();
      });
    }
  });
});

function onDocumentReady(callback: () => void) {
  // in case the document is already rendered
  if (document.readyState !== 'loading') {
    callback();
  }
  // modern browsers
  else if (document.addEventListener) {
    document.addEventListener('DOMContentLoaded', callback);
  }
}

export const BrowserExtensionPlugin = (): TolgeePlugin => (tolgee) => {
  registredInstances.push(tolgee);
  Promise.resolve().then(async () => {
    // do it async, so we override
    const credentials = getCredentials();
    if (credentials.apiKey) {
      tolgee.init({
        ...credentials,
      });
    }
    onDocumentReady(() => {
      handshakeWithExtension({
        uiPresent: true,
        uiVersion: undefined,
        noRestart: true,
        mode: 'production',
        config: {
          apiUrl: 'https://app.tolgee.io',
          apiKey: '',
        },
      }).catch(clearSessionStorage);
    });
  });

  return tolgee;
};
