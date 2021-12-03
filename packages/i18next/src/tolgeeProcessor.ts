import { Tolgee } from '@tolgee/core';
import { Module } from 'i18next';

export const TOLGEE_PROCESSOR_NAME = 'tolgeeProcessor';

export const tolgeeProcessor = (tolgee: Tolgee): Module => {
  return {
    type: 'postProcessor',
    name: 'tolgeeProcessor',
    process: function (value: string, key: string[], options) {
      return tolgee.wrap(key.join('.'), undefined, options.defaultValue, value);
    },
  } as any as Module;
};
