import type { DevCredentials, TolgeePlugin } from '@tolgee/core';
import { Handshaker } from '../tools/extension';
import {
  EXTENSION_PROTOCOL_VERSION,
  isExtensionSessionKind,
} from '../tools/extensionProtocol';
import { resolveLiveCredential } from '../tools/auth';
import { proxyTransport } from '../tools/apiTransport';
import {
  API_KEY_SESSION_STORAGE,
  API_URL_SESSION_STORAGE,
  BRANCH_SESSION_STORAGE,
  EXTENSION_SESSION_STORAGE,
  PROJECT_ID_SESSION_STORAGE,
  TOLGEE_EXTENSION_SESSION_STORAGE_PREFIX,
} from '../tools/sessionStorageKeys';
import { loadInContextLib } from './loadInContextLib';

function getCredentials(): DevCredentials {
  const apiKey = sessionStorage.getItem(API_KEY_SESSION_STORAGE) || undefined;
  const apiUrl = sessionStorage.getItem(API_URL_SESSION_STORAGE) || undefined;
  const branch = sessionStorage.getItem(BRANCH_SESSION_STORAGE) || undefined;
  const projectId =
    sessionStorage.getItem(PROJECT_ID_SESSION_STORAGE) || undefined;
  const viaExtension = isExtensionSessionKind(
    sessionStorage.getItem(EXTENSION_SESSION_STORAGE)
  );

  if (!apiUrl) {
    return undefined;
  }
  const common = {
    apiUrl,
    ...(projectId !== undefined ? { projectId } : {}),
    ...(branch !== undefined ? { branch } : {}),
  };
  if (apiKey) {
    return { ...common, apiKey };
  }
  if (viaExtension && projectId) {
    return { ...common, transport: proxyTransport() };
  }
  return undefined;
}

// See TOLGEE_EXTENSION_SESSION_STORAGE_PREFIX in sessionStorageKeys.ts for why this sweeps by prefix.
export function clearSessionStorage() {
  const keysToRemove: string[] = [];
  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);
    if (key?.startsWith(TOLGEE_EXTENSION_SESSION_STORAGE_PREFIX)) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach((key) => sessionStorage.removeItem(key));
}

function warnIfProjectIdMissing(tolgee: Parameters<TolgeePlugin>[0]) {
  if (!tolgee.isDev()) {
    return;
  }
  const { requiresExplicitProject, projectId } = resolveLiveCredential(
    tolgee.getInitialOptions()
  );
  if (requiresExplicitProject && projectId === undefined) {
    // eslint-disable-next-line no-console
    console.warn(
      'Tolgee: `projectId` is missing from the SDK configuration. It is required when authenticating with a PAT ' +
        'or connecting through the Tolgee browser extension. ' +
        'See https://docs.tolgee.io/js-sdk/api/core_package/options#projectid'
    );
  }
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
        protocolVersion: EXTENSION_PROTOCOL_VERSION,
        // tolgee mode
        mode: tolgee.isDev() ? 'development' : 'production',
        // pass credentials
        config: {
          apiUrl: options.apiUrl || '',
          apiKey: options.transport ? '' : options.apiKey || '',
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

    warnIfProjectIdMissing(tolgee);

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
