import { Tolgee } from '@tolgee/core';
import { Module } from 'i18next';

export const TOLGEE_PROCESSOR_NAME = 'tolgeeProcessor';

export const tolgeeProcessor = (tolgee: Tolgee): Module => {
  return {
    type: 'postProcessor',
    name: 'tolgeeProcessor',
    process: function (value: string, key: string[], options) {
      const ns = options.ns;
      const nsKey = (ns ? ns + '.' : '') + key.join('.');
      return tolgee.wrap(nsKey, undefined, options.defaultValue, value);
    },
  } as any as Module;
};
