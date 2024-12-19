import { TolgeeInstance } from '@tolgee/web';
import { Module } from 'i18next';

export const tolgeeBackend = (tolgee: TolgeeInstance): Module => {
  return {
    type: 'backend',
    name: 'TolgeeBackend',
    init() {},
    read: async function (language: string, ns: string, callback: any) {
      try {
        const translations = await tolgee.loadRecord({
          language,
          namespace: ns,
        });
        callback(
          null,
          translations instanceof Map
            ? Object.fromEntries(translations)
            : translations
        );
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
        callback(true);
      }
    },
  } as unknown as Module;
};
