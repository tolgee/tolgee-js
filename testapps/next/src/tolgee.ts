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
      'namespaced:en': () => import('../messages/namespaced/en.json'),
      'namespaced:cs': () => import('../messages/namespaced/cs.json'),
      'namespaced:de': () => import('../messages/namespaced/de.json'),
      'namespaced:fr': () => import('../messages/namespaced/fr.json'),
    },
  });
