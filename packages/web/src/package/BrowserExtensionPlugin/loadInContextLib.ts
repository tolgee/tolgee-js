import type { InContextTools } from '../InContextTools';
import { isSSR } from '../tools/isSSR';
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

type LocationLike = { origin: string; hostname: string; href: string };

const isDevHost = (hostname: string) =>
  hostname === 'localhost' ||
  hostname === '127.0.0.1' ||
  hostname === '::1' ||
  hostname === '[::1]';

// The injected UMD runs with the page's session/OAuth token, so a cross-origin override would be an arbitrary-script
// load.
export function isTrustedInContextUrl(
  override: string | undefined,
  location: LocationLike
): boolean {
  if (!override || !isDevHost(location.hostname)) {
    return false;
  }
  try {
    const url = new URL(override, location.href);
    return url.origin === location.origin || isDevHost(url.hostname);
  } catch {
    return false;
  }
}

export function overrideUrl(): string | undefined {
  if (isSSR()) {
    return undefined;
  }
  const override = (window as { __TOLGEE_IN_CONTEXT_URL__?: string })
    .__TOLGEE_IN_CONTEXT_URL__;
  return isTrustedInContextUrl(override, window.location)
    ? override
    : undefined;
}

export function inContextLibSrc(version: string): string {
  return (
    overrideUrl() || `${CDN_URL}/@tolgee/web@${version}/dist/${IN_CONTEXT_FILE}`
  );
}

let injectPromise = null as any as Promise<typeof InContextTools>;

export function loadInContextLib(version: string) {
  if (!injectPromise) {
    injectPromise = injectScript(inContextLibSrc(version)).then(() => {
      // @ts-ignore
      return window[IN_CONTEXT_UMD_NAME][IN_CONTEXT_EXPORT_NAME];
    });
  }
  return injectPromise;
}
