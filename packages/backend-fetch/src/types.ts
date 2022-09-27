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
