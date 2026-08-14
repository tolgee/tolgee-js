import type { TolgeePlugin } from '@tolgee/core';
import { Handshaker } from '../tools/extension';
import { resolveCredential } from '../tools/auth';
import {
  API_KEY_LOCAL_STORAGE,
  API_URL_LOCAL_STORAGE,
  AUTH_TOKEN_LOCAL_STORAGE,
  BRANCH_LOCAL_STORAGE,
  PROJECT_ID_LOCAL_STORAGE,
} from '../tools/sessionStorageKeys';
import { loadInContextLib } from './loadInContextLib';

function getCredentials() {
  const apiKey = sessionStorage.getItem(API_KEY_LOCAL_STORAGE) || undefined;
  const apiUrl = sessionStorage.getItem(API_URL_LOCAL_STORAGE) || undefined;
  const branch = sessionStorage.getItem(BRANCH_LOCAL_STORAGE) || undefined;
  const authToken =
    sessionStorage.getItem(AUTH_TOKEN_LOCAL_STORAGE) || undefined;
  const projectId =
    sessionStorage.getItem(PROJECT_ID_LOCAL_STORAGE) || undefined;

  if ((!apiKey && !authToken) || !apiUrl) {
    return undefined;
  }

  return {
    apiUrl,
    ...(apiKey !== undefined ? { apiKey } : {}),
    ...(authToken !== undefined ? { authToken } : {}),
    ...(projectId !== undefined ? { projectId } : {}),
    ...(branch !== undefined ? { branch } : {}),
  };
}

export function clearSessionStorage() {
  sessionStorage.removeItem(API_KEY_LOCAL_STORAGE);
  sessionStorage.removeItem(API_URL_LOCAL_STORAGE);
  sessionStorage.removeItem(BRANCH_LOCAL_STORAGE);
  sessionStorage.removeItem(AUTH_TOKEN_LOCAL_STORAGE);
  sessionStorage.removeItem(PROJECT_ID_LOCAL_STORAGE);
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
    const getConfig = () => {
      const options = tolgee.getInitialOptions();
      return {
        // prevent extension downloading ui library
        uiPresent: true,
        uiVersion: undefined,
        // tolgee mode
        mode: tolgee.isDev() ? 'development' : 'production',
        // pass credentials
        config: {
          apiUrl: options.apiUrl || '',
          apiKey: options.apiKey || '',
          authToken: options.authToken,
          projectId: options.projectId,
          branch: options.branch,
        },
      } as const;
    };

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

    // Ask the same authority the fetch paths use, folding in the extension-injected projectId, so the advisory can't
    // disagree with whether a request will actually require an explicit project.
    const options = tolgee.getInitialOptions();
    const injectedProjectId =
      sessionStorage.getItem(PROJECT_ID_LOCAL_STORAGE) || undefined;
    const { requiresExplicitProject, projectId } = resolveCredential({
      apiKey: options.apiKey,
      authToken: options.authToken,
      projectId: options.projectId ?? injectedProjectId,
    });
    if (tolgee.isDev() && requiresExplicitProject && projectId === undefined) {
      // eslint-disable-next-line no-console
      console.warn(
        'Tolgee: `projectId` is missing from the SDK configuration. The Tolgee browser extension needs it to ' +
          'connect in-context editing. ' +
          'See https://docs.tolgee.io/js-sdk/api/core_package/options#projectid'
      );
    }

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
