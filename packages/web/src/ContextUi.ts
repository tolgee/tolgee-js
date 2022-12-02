import { TolgeePlugin, UiMiddleware } from '@tolgee/core';
import { isSSR } from './tools/isSSR';
import { UI } from './ui/index';

export const ContextUi = (): TolgeePlugin => (tolgee, tools) => {
  let ui: UiMiddleware | undefined = undefined;

  if (!isSSR()) {
    ui = (props) => new UI(props);
  }
  tools.setUi(ui);
  return tolgee;
};
