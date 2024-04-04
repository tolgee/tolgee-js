import type { InContextTools } from '../InContextTools';
import {
  IN_CONTEXT_FILE,
  IN_CONTEXT_UMD_NAME,
  IN_CONTEXT_EXPORT_NAME,
} from './constants';

const CDN_URL = 'https://cdn.jsdelivr.net/npm';

function injectScript(src: string) {
  return new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.addEventListener('load', () => resolve());
    script.addEventListener('error', (e) => reject(e.error));
    document.head.appendChild(script);
  });
}

let injectPromise = null as any as Promise<typeof InContextTools>;

export function loadInContextLib(version: string) {
  if (!injectPromise) {
    injectPromise = injectScript(
      `${CDN_URL}/@tolgee/web@${version}/dist/${IN_CONTEXT_FILE}`
    ).then(() => {
      // @ts-ignore
      return window[IN_CONTEXT_UMD_NAME][IN_CONTEXT_EXPORT_NAME];
    });
  }
  return injectPromise;
}
