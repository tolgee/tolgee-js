export type ObserverOptions = {
  tagAttributes: Record<string, string[]>;
  highlightKeys: ModifierKey[];
  highlightColor: string;
  highlightWidth: number;
  targetElement?: HTMLElement;
  restrictedElements: string[];
  inputPrefix: string;
  inputSuffix: string;
  passToParent: (keyof HTMLElementTagNameMap)[] | ((node: Element) => boolean);
};

export enum ModifierKey {
  Alt,
  Control,
  Shift,
  Meta,
}

export type NodeLock = {
  locked?: boolean;
};

export type TolgeeElement = Element &
  ElementCSSInlineStyle & {
    _tolgee?: boolean;
  };

import type { BackendGetRecordProps, TreeTranslationsData } from '@tolgee/core';

export type BackendOptions = Omit<RequestInit, 'headers'> & {
  /**
   * Path prefix (default: '/i18n')
   */
  prefix: string;
  /**
   * Generate own path based on namespace, language and prefix
   */
  getPath: GetPath;
  /**
   * Custom headers
   */
  headers: Record<string, string>;
  /**
   * Extract data from fetch response (default: (r) => r.json())
   */
  getData: (r: Response) => Promise<TreeTranslationsData | undefined>;
};

export type GetPath = (
  options: BackendGetRecordProps & { prefix: string }
) => string;
