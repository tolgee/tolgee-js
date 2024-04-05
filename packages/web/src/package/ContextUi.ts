import { TolgeePlugin, UiMiddleware } from '@tolgee/core';
import { isSSR } from './tools/isSSR';
import { InContextUi } from './ui/InContextUi';

export const ContextUi = (): TolgeePlugin => (tolgee, tools) => {
  let ui: UiMiddleware | undefined = undefined;

  if (!isSSR()) {
    ui = (props) => InContextUi(props);
  }
  tools.setUi(ui);
  return tolgee;
};
