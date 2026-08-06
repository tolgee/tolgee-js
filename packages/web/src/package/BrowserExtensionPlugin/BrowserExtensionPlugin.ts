import type { TolgeePlugin } from '@tolgee/core';
import { Handshaker } from '../tools/extension';
import { loadInContextLib } from './loadInContextLib';

export const API_KEY_LOCAL_STORAGE = '__tolgee_apiKey';
export const API_URL_LOCAL_STORAGE = '__tolgee_apiUrl';
export const BRANCH_LOCAL_STORAGE = '__tolgee_branch';
export const AUTH_TOKEN_LOCAL_STORAGE = '__tolgee_authToken';

function getCredentials() {
  const apiKey = sessionStorage.getItem(API_KEY_LOCAL_STORAGE) || undefined;
  const apiUrl = sessionStorage.getItem(API_URL_LOCAL_STORAGE) || undefined;
  const branch = sessionStorage.getItem(BRANCH_LOCAL_STORAGE) || undefined;
  const authToken =
    sessionStorage.getItem(AUTH_TOKEN_LOCAL_STORAGE) || undefined;

  // Either a static api key or an OAuth access token is enough to authenticate against the backend.
  if ((!apiKey && !authToken) || !apiUrl) {
    return undefined;
  }

  return {
    apiKey,
    apiUrl,
    ...(authToken !== undefined ? { authToken } : {}),
    ...(branch !== undefined ? { branch } : {}),
  };
}

function clearSessionStorage() {
  sessionStorage.removeItem(API_KEY_LOCAL_STORAGE);
  sessionStorage.removeItem(API_URL_LOCAL_STORAGE);
  sessionStorage.removeItem(BRANCH_LOCAL_STORAGE);
  sessionStorage.removeItem(AUTH_TOKEN_LOCAL_STORAGE);
}

function onDocumentReady(callback: () => void) {
  // in case the document is already rendered
  if (document.readyState !== 'loading') {
    Promise.resolve().then(() => {
      callback();
    });
  }
  // modern browsers
  else if (document.addEventListener) {
    document.addEventListener('DOMContentLoaded', callback);
  }
}

export type BrowserExtensionProps = {
  noReload?: boolean;
};

let BrowserExtensionPlugin: () => TolgeePlugin = () => (tolgee) => tolgee;

const sessionStorageAvailable = () => {
  if (typeof window === 'undefined') {
    return false;
  }
  try {
    return typeof sessionStorage !== 'undefined' && sessionStorage;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('sessionStorage not available', err);
    return false;
  }
};

if (sessionStorageAvailable()) {
  BrowserExtensionPlugin = (): TolgeePlugin => (tolgee) => {
    const handshaker = Handshaker();
    const getConfig = () =>
      ({
        // prevent extension downloading ui library
        uiPresent: true,
        uiVersion: undefined,
        // tolgee mode
        mode: tolgee.isDev() ? 'development' : 'production',
        // pass credentials
        config: {
          apiUrl: tolgee.getInitialOptions().apiUrl || '',
          apiKey: tolgee.getInitialOptions().apiKey || '',
          authToken: tolgee.getInitialOptions().authToken,
          branch: tolgee.getInitialOptions().branch,
        },
      }) as const;

    const getTolgeePlugin = async (): Promise<TolgeePlugin> => {
      const InContextTools = await loadInContextLib(
        process.env.TOLGEE_UI_VERSION || 'prerelease'
      );
      return (tolgee) => {
        const credentials = getCredentials()!;
        tolgee.addPlugin(InContextTools({ credentials }));
        return tolgee;
      };
    };

    tolgee.on('running', ({ value: isRunning }) => {
      if (isRunning) {
        onDocumentReady(() => {
          handshaker.update(getConfig()).catch(clearSessionStorage);
        });
      }
    });

    const credentials = getCredentials();
    if (credentials) {
      getTolgeePlugin()
        .then((plugin) => {
          tolgee.addPlugin(plugin);
        })
        .catch((e) => {
          // eslint-disable-next-line no-console
          console.error('Tolgee: Failed to load in-context tools');
          // eslint-disable-next-line no-console
          console.error(e);
        });
    }

    return tolgee;
  };
}

export { BrowserExtensionPlugin };
