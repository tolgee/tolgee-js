import { Tolgee } from '@tolgee/core';
import { Module } from 'i18next';

export const tolgeeBackend = (tolgee: Tolgee): Module => {
  return {
    type: 'backend',
    name: 'TolgeeBackend',
    init() {},
    read: async function (language: string, ns: string, callback: any) {
      try {
        const translations = await tolgee.loadTranslations(language);
        callback(null, translations);
      } catch {
        callback(true);
      }
    },
  } as unknown as Module;
};
