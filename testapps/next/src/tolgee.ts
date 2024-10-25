import { FormatIcu } from '@tolgee/format-icu';
import { Tolgee, DevTools } from '@tolgee/react';

export async function getStaticData(
  languages: string[],
  namespaces: string[] = ['']
) {
  const result: Record<string, any> = {};
  for (const lang of languages) {
    for (const namespace of namespaces) {
      if (namespace) {
        result[`${lang}:${namespace}`] = (
          await import(`../messages/${namespace}/${lang}.json`)
        ).default;
      } else {
        result[lang] = (await import(`../messages/${lang}.json`)).default;
      }
    }
  }
  return result;
}

export const tolgee = Tolgee()
  .use(FormatIcu())
  .use(DevTools())
  .init({
    availableLanguages: ['en', 'cs'],
    defaultLanguage: 'en',
    apiKey: process.env.NEXT_PUBLIC_TOLGEE_API_KEY,
    apiUrl: process.env.NEXT_PUBLIC_TOLGEE_API_URL,
  });
