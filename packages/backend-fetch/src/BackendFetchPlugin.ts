import type { TolgeePlugin } from '@tolgee/core';
import { BackendFetch } from './BackendFetch';
import { BackendOptions } from './types';

export const BackendPlugin =
  (options?: Partial<BackendOptions>): TolgeePlugin =>
  (tolgee, tools) => {
    tools.addBackend(BackendFetch());
    return tolgee;
  };
