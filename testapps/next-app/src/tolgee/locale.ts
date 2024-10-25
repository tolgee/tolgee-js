'use server';

import { cookies, headers } from 'next/headers';
import { ALL_LOCALES, DEFAULT_LOCALE } from './shared';

const LOCALE_COOKIE = 'NEXT_LOCALE';

export async function setLocale(locale: string) {
  const cookieStore = cookies();
  cookieStore.set({
    name: LOCALE_COOKIE,
    value: locale,
  });
}

export async function getLocale() {
  const cookieStore = cookies();
  const locale = cookieStore.get(LOCALE_COOKIE)?.value;
  if (locale && ALL_LOCALES.includes(locale)) {
    return locale;
  } else {
    return (await detectLanguage()) ?? DEFAULT_LOCALE;
  }
}

const detectLanguage = async () => {
  const allPreferred = await getAcceptedLanguages();

  for (const language of allPreferred) {
    const exactMatch = ALL_LOCALES.find((l) => l === language);
    if (exactMatch) {
      return exactMatch;
    }

    const getTwoLetters = (fullTag: string) =>
      fullTag.replace(/^(.+?)(-.*)?$/, '$1');

    const preferredTwoLetter = getTwoLetters(language);
    const twoLetterMatch = ALL_LOCALES.find(
      (l) => getTwoLetters(l) === preferredTwoLetter
    );
    if (twoLetterMatch) {
      return twoLetterMatch;
    }
  }
};

async function getAcceptedLanguages() {
  const acceptLanguageHeader = await getAcceptLanguageHeader();
  if (!acceptLanguageHeader) {
    return [];
  }

  return acceptLanguageHeader.split(',').map((lang) => {
    const [language] = lang.split(';');
    return language.trim();
  });
}

async function getAcceptLanguageHeader() {
  return await headers().get('Accept-Language');
}
