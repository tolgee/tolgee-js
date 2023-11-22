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
          translations ? Object.fromEntries(translations) : undefined
        );
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
        callback(true);
      }
    },
  } as unknown as Module;
};
