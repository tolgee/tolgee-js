import { TolgeeInstance } from '@tolgee/web';
import { Module } from 'i18next';

export const TOLGEE_PROCESSOR_NAME = 'tolgeeProcessor';

export const tolgeeProcessor = (tolgee: TolgeeInstance): Module => {
  return {
    type: 'postProcessor',
    name: 'tolgeeProcessor',
    process: function (value: string, keyIn: string[], options, translator) {
      // if namespace is in the key, we need to extract it
      // https://github.com/i18next/i18next/issues/2049
      const { key } = translator.extractFromKey(
        keyIn.join(options.keySeparator || '.'),
        {}
      );
      return tolgee.wrap({
        key,
        defaultValue: options.defaultValue,
        translation: value,
        ns: options.ns || translator?.options?.defaultNS,
      });
    },
  } as any as Module;
};
