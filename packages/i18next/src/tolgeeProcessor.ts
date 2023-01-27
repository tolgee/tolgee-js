import { TolgeeInstance } from '@tolgee/web';
import { Module } from 'i18next';

export const TOLGEE_PROCESSOR_NAME = 'tolgeeProcessor';

export const tolgeeProcessor = (tolgee: TolgeeInstance): Module => {
  return {
    type: 'postProcessor',
    name: 'tolgeeProcessor',
    process: function (value: string, key: string[], options) {
      return tolgee.wrap({
        key: key.join('.'),
        defaultValue: options.defaultValue,
        translation: value,
        ns: options.ns,
      });
    },
  } as any as Module;
};
