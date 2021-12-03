import { Tolgee } from '@tolgee/core';
import { Module } from 'i18next';

export const tolgeeBackend = (tolgee: Tolgee): Module => {
  return {
    type: 'backend',
    name: 'TolgeeBackend',
    init() {},
    read: function (language: string, ns: string, callback: any) {
      if (language !== tolgee.lang) {
        tolgee.lang = language;
      }
      tolgee
        .translate('random')
        .then(() => {
          const translations = tolgee.translationService
            .getChachedTranslations()
            .get(language);
          callback(null, translations);
        })
        .catch(() => callback(true));
    },
  } as unknown as Module;
};
