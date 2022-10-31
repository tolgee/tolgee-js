export {
  ObserverOptions,
  ModifierKey,
} from './observers/general/initObserverOptions';

import type {
  BackendGetRecordProps,
  DevCredentials,
  TreeTranslationsData,
} from '@tolgee/core';
import { ObserverOptions } from './observers/general/initObserverOptions';

export type InContextOptions = Partial<ObserverOptions> & {
  credentials?: DevCredentials;
  observerType?: 'text' | 'invisible';
};

export type NodeLock = {
  locked?: boolean;
};

export type TolgeeElement = Element &
  ElementCSSInlineStyle & {
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
};

export type GetPath = (
  options: BackendGetRecordProps & { prefix: string }
) => string;
