import type {
  BackendGetRecordProps,
  DevCredentials,
  KeyAndParams,
  TreeTranslationsData,
} from '@tolgee/core';

export type InContextOptions = {
  credentials?: DevCredentials;
};

export type NodeLock = {
  locked?: boolean;
};

export type TolgeeElement = HTMLElement & {
  _tolgee?: boolean;
};

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
  /**
   *
   */
  timeout: number;
  /**
   * In case of error, fallback to next backend
   */
  fallbackOnFail: boolean;
};

export type GetPath = (
  options: BackendGetRecordProps & { prefix: string }
) => string;

export type KeyDescriptorInternal = {
  key?: string;
  ns?: string[] | undefined;
};

export type NodeMeta = {
  oldTextContent: string;
  keys: KeyAndParams[];
  keyAttributeOnly?: boolean;
};

export type ElementMeta = {
  element: TolgeeElement;
  wrappedWithElementOnlyKey?: string;
  wrappedWithElementOnlyDefaultHtml?: string;
  nodes: Map<Node, NodeMeta>;
  highlightEl?: HTMLDivElement;
  highlight?: () => void;
  unhighlight?: () => void;
  /**
   * Stops removing of element's inactive nodes and
   * unregistering from ElementRegistrar.
   *
   * It's used when user has mouse on the element, so there is
   * potential, that element highlight will be triggered.
   *
   * Triggering highlight needs the metadata stored on element, so
   * we need the ability to prevent clean.
   */
  preventClean?: boolean;
};
