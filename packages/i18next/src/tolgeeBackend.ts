import { TolgeeInstance } from '@tolgee/core';
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
          namespace: ns === 'translation' ? '' : undefined,
        });
        callback(null, Object.fromEntries(translations));
      } catch {
        callback(true);
      }
    },
  } as unknown as Module;
};
