import type { TolgeeInstance, TolgeePlugin } from '@tolgee/core';
import { isDataView } from 'util/types';
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

let BrowserExtensionPlugin = (): TolgeePlugin => (tolgee) => tolgee;

if (typeof window !== 'undefined') {
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

  BrowserExtensionPlugin = (): TolgeePlugin => (tolgee) => {
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
          mode: tolgee.isDev() ? 'development' : 'production',
          config: {
            apiUrl: tolgee.getInitialOptions().apiUrl || '',
            apiKey: tolgee.getInitialOptions().apiKey || '',
          },
        }).catch(clearSessionStorage);
      });
    });

    return tolgee;
  };
}

export { BrowserExtensionPlugin };
