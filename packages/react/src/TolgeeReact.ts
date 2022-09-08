import { ObserverOptions, Options, Tolgee } from '@tolgee/core';
import { DevTools } from '@tolgee/devtools-web';
import { GlobalInstance } from './GlobalInstance';

export const TolgeeReact = (
  options?: Partial<Options>,
  observerOptions?: Partial<ObserverOptions>
) => {
  return Tolgee(options).use(DevTools(observerOptions)).use(GlobalInstance);
};
