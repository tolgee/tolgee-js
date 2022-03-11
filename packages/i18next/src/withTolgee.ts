import { Tolgee, TolgeeConfig } from '@tolgee/core';
import { Callback, i18n, InitOptions } from 'i18next';
import { tolgeeApply } from './tolgeeApply';
import { tolgeeBackend } from './tolgeeBackend';
import { tolgeeOptions } from './tolgeeOptions';
import { tolgeeProcessor } from './tolgeeProcessor';

export const withTolgee = (i18n: i18n, config: TolgeeConfig) => {
  const tolgee = Tolgee.init({
    wrapperMode: 'invisible',
    enableLanguageDetection: false,
    enableLanguageStore: false,
    ...config,
  });
  i18n.use(tolgeeBackend(tolgee));
  i18n.use(tolgeeProcessor(tolgee));

  const originalInit = i18n.init;
  const newInit: typeof originalInit = (...params) => {
    tolgeeApply(tolgee, i18n);
    let options: InitOptions = {};
    let callback: Callback | undefined = undefined;

    if (typeof params[0] === 'object') {
      options = params[0] as InitOptions;
      callback = params[1] as Callback;
    } else {
      callback = params[0] as Callback;
    }
    const newOptions = tolgeeOptions(tolgee, options);
    const result = originalInit(newOptions, callback);
    const language = i18n.language || options.lng;
    if (language) {
      tolgee.lang = language;
    }
    tolgee.run();
    return result;
  };
  i18n.init = newInit;
  return i18n;
};
