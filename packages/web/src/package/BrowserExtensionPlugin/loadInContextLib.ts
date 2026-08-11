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
    // Dev override: load the in-context UMD from a local build instead of the CDN, so unpublished SDK changes (e.g. the
    // OAuth Bearer support) can be exercised in-context. Set window.__TOLGEE_IN_CONTEXT_URL__ to a served
    // tolgee-in-context-tools.umd.min.js before Tolgee initializes.
    const override =
      typeof window !== 'undefined'
        ? (window as { __TOLGEE_IN_CONTEXT_URL__?: string })
            .__TOLGEE_IN_CONTEXT_URL__
        : undefined;
    const src =
      override || `${CDN_URL}/@tolgee/web@${version}/dist/${IN_CONTEXT_FILE}`;
    injectPromise = injectScript(src).then(() => {
      // @ts-ignore
      return window[IN_CONTEXT_UMD_NAME][IN_CONTEXT_EXPORT_NAME];
    });
  }
  return injectPromise;
}
