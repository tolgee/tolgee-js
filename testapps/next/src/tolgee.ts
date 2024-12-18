import { FormatIcu } from '@tolgee/format-icu';
import { Tolgee, DevTools } from '@tolgee/react';

export const tolgee = Tolgee()
  .use(FormatIcu())
  .use(DevTools())
  .init({
    availableLanguages: ['en', 'cs'],
    defaultLanguage: 'en',
    apiKey: process.env.NEXT_PUBLIC_TOLGEE_API_KEY,
    apiUrl: process.env.NEXT_PUBLIC_TOLGEE_API_URL,
    staticData: {
      en: () => import('../messages/en.json'),
      cs: () => import('../messages/cs.json'),
      de: () => import('../messages/de.json'),
      fr: () => import('../messages/fr.json'),
      'en:namespaced': () => import('../messages/namespaced/en.json'),
      'cs:namespaced': () => import('../messages/namespaced/cs.json'),
      'de:namespaced': () => import('../messages/namespaced/de.json'),
      'fr:namespaced': () => import('../messages/namespaced/fr.json'),
    },
  });
