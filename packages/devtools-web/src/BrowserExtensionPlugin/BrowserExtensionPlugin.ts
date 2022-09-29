import type { TolgeePlugin } from '@tolgee/core';
import { handshakeWithExtension, listen, updateConfig } from '../tools/plugin';
import { injectUiLib } from './injectUiLib';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const API_KEY_LOCAL_STORAGE = '__tolgee_apiKey';
export const API_URL_LOCAL_STORAGE = '__tolgee_apiUrl';

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

type Props = {
  noReload?: boolean;
};

let BrowserExtensionPlugin =
  (props?: Props): TolgeePlugin =>
  (tolgee) =>
    tolgee;

if (typeof window !== 'undefined') {
  BrowserExtensionPlugin =
    (props?: Props): TolgeePlugin =>
    (tolgee) => {
      const getConfig = () =>
        ({
          uiPresent: true,
          uiVersion: undefined,
          noRestart: Boolean(props?.noReload),
          mode: tolgee.isDev() ? 'development' : 'production',
          config: {
            apiUrl: tolgee.getInitialOptions().apiUrl || '',
            apiKey: tolgee.getInitialOptions().apiKey || '',
          },
        } as const);

      const tolgeePlugin = async (): Promise<TolgeePlugin> => {
        await injectUiLib(process.env.TOLGEE_UI_VERSION || 'rc');
        return (tolgee) => {
          const credentials = getCredentials();
          // @ts-ignore
          const InContextProduction = window['@tolgee/ui'].InContextProduction;
          tolgee.use(InContextProduction());
          tolgee.init({
            ...credentials,
          });
          return tolgee;
        };
      };

      listen('SET_CREDENTIALS', async () => {
        const credentials = getCredentials();
        if (credentials.apiKey) {
          const { unsubscribe } = tolgee.on('initialLoad', async () => {
            unsubscribe();
            const result = tolgee.highlight();
            await sleep(300);
            result.unhighlight();
          });
          tolgee.use(await tolgeePlugin());
          updateConfig(getConfig()).catch(clearSessionStorage);
        }
      });

      Promise.resolve().then(async () => {
        // do it async, so we override
        const credentials = getCredentials();
        if (credentials.apiKey) {
          tolgee.use(await tolgeePlugin());
        }
        onDocumentReady(() => {
          handshakeWithExtension(getConfig()).catch(clearSessionStorage);
        });
      });

      return tolgee;
    };
}

export { BrowserExtensionPlugin };
