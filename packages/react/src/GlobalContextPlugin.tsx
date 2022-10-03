import type { TolgeePlugin } from '@tolgee/web';
import { DEFAULT_REACT_OPTIONS } from './TolgeeProvider';
import type { ReactOptions, TolgeeReactContext } from './types';

let globalContext: TolgeeReactContext | undefined;

export const GlobalContextPlugin =
  (options?: Partial<ReactOptions>): TolgeePlugin =>
  (tolgee) => {
    globalContext = {
      tolgee,
      options: { ...DEFAULT_REACT_OPTIONS, ...options },
    };
    return tolgee;
  };

export function getGlobalContext() {
  return globalContext;
}
