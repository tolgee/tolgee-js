import type { TolgeeInstance, KeyPosition, Highlighter } from '@tolgee/core';
import { isSSR } from './tools/isSSR';

export interface TolgeeWindowApi {
  getVisibleKeys(): KeyPosition[];
  highlight(keyName?: string, ns?: string): Highlighter;
  isRunning(): boolean;
}

declare global {
  interface Window {
    __tolgee?: TolgeeWindowApi;
  }
}

export function setupWindowApi(tolgee: TolgeeInstance): () => void {
  if (isSSR()) {
    return () => {};
  }

  window.__tolgee = {
    getVisibleKeys() {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      return tolgee.findPositions().filter(({ position: p }) => {
        return p.x + p.width > 0 && p.y + p.height > 0 && p.x < vw && p.y < vh;
      });
    },
    highlight(keyName?: string, ns?: string) {
      return tolgee.highlight(keyName, ns);
    },
    isRunning() {
      return tolgee.isRunning();
    },
  };

  return () => {
    delete window.__tolgee;
  };
}
