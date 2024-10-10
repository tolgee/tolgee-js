import { getLocale } from 'next-intl/server';

import { TolgeeBase, ALL_LOCALES } from './shared';
import { createServerInstance } from '@tolgee/react/server';

export const { getTolgee, getTranslate, T, loadMatrix } = createServerInstance({
  getLocale: getLocale,
  createTolgee: async (locale) => {
    const tolgee = TolgeeBase().init({
      observerOptions: {
        fullKeyEncode: true,
      },
      language: locale,
    });
    await tolgee.loadMatrix(ALL_LOCALES);
    return tolgee;
  },
});
