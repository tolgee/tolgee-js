import { Tolgee } from '@tolgee/core';
import { InitOptions } from 'i18next';
import { TOLGEE_PROCESSOR_NAME } from './tolgeeProcessor';

export const tolgeeOptions = (tolgee: Tolgee, options?: InitOptions) => {
  let processors: string[];
  if (typeof options.postProcess === 'string') {
    processors = [options.postProcess, TOLGEE_PROCESSOR_NAME];
  } else if (Array.isArray(options.postProcess)) {
    processors = [...options.postProcess, TOLGEE_PROCESSOR_NAME];
  } else {
    processors = [TOLGEE_PROCESSOR_NAME];
  }

  const newOptions = {
    ...options,
    defaultNS: tolgee.properties.config.defaultNS || 'root',
    ns: tolgee.properties.config.ns?.map((ns) => (ns === '' ? 'root' : ns)),
    postProcess: processors,
    i18nFormat: {
      ...options?.i18nFormat,
      // @ts-ignore
      bindI18nStore: 'added ' + options.i18nFormat?.bindI18nStore || '',
    },
    react: {
      ...options?.react,
      // @ts-ignore
      bindI18nStore: 'added ' + options.react?.bindI18nStore || '',
    },
  };
  return newOptions;
};
