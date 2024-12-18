import { getLocale } from 'next-intl/server';
import { createServerInstance } from '@tolgee/react/server';
import { TolgeeBase } from './shared';

export const { getTolgee, getTranslate, T } = createServerInstance({
  getLocale: getLocale,
  createTolgee: async (language) => {
    const tolgee = TolgeeBase().init({
      observerOptions: {
        fullKeyEncode: true,
      },
      language,
    });
    // preload all the languages for the server instance
    await tolgee.loadRequired();
    return tolgee;
  },
});
